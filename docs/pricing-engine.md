# Roseair Marketplace — Pricing Engine

## 1. Purpose

The Pricing Engine is the backend service responsible for computing the Buyer-facing **Marketplace Price** of every product, keeping it current with exchange-rate fluctuations, and enforcing that raw supplier economics are never exposed. It is a first-class backend service (not a helper function) because it: (a) has its own approval workflow, (b) must react to external triggers (FX rate changes), and (c) is the single source of truth multiple contexts depend on (Catalog, Ordering, Invoicing).

## 2. Inputs

For a given `Product`, the Pricing Engine consumes:

| Component | Description | Owner / Source |
|---|---|---|
| Supplier Cost | Raw cost quoted by the supplier the Agent sourced from. | Entered by Agent at product submission. |
| Freight | Shipping cost allocated to this product/shipment. | Calculated by Roseair ops (may depend on CBM, see below) or entered manually in MVP. |
| CBM Allocation | Cost derived from the product's volumetric footprint (cubic meters) as a share of container/shipment cost. | Calculated from product dimensions × a per-CBM freight rate maintained by Roseair. |
| Pre-shipping Costs | Inspection, local handling, documentation fees at origin. | Entered by Roseair ops. |
| Operational Costs | Roseair's internal handling/processing overhead allocation. | Configured rate (flat or %) maintained by Roseair. |
| Insurance | Optional cargo insurance cost, when applicable. | Entered by Roseair ops or computed as % of declared value. |
| Roseair Commission | Roseair's margin. | Configured rate (flat or %) maintained by Roseair, may vary by category. |
| Exchange Rate | Conversion rate from calculation currency (assumed USD, per `business.md §11.1`) to MZN. | Maintained in `ExchangeRate` (manual entry in MVP; external FX API integration is a Phase 3 candidate). |

## 3. Computation

```
MarketplacePrice (MZN) =
      ( SupplierCost
      + Freight
      + CbmAllocation
      + PreShippingCosts
      + OperationalCosts
      + Insurance            // 0 if not applicable
      + RoseairCommission
      ) × ExchangeRate.Rate
```

All component amounts are computed/stored in the calculation currency (USD) except the final `MarketplacePrice`, which is stored in MZN for direct display. Each component is persisted individually on the `ProductPrice` record (`domain-model.md §2.3`) — never collapsed — so that:
- Admins can audit exactly how a price was built.
- Recalculation can re-derive only the components that actually changed (e.g., only the FX conversion) without re-entering the rest.
- Reporting can answer "what % of marketplace price is commission vs. freight" (`roadmap.md` / Admin Dashboard reporting).

## 4. Approval Workflow

1. Agent submits Product with `SupplierCost` (only field an Agent can set).
2. Roseair Ops fills remaining components (Freight, CBM, Pre-shipping, Operational, Insurance) and confirms/overrides Commission rate.
3. Pricing Engine computes `MarketplacePrice` → `ProductPrice.Status = PendingApproval`.
4. Admin reviews and either `Approves` (→ becomes `Product.CurrentPriceId`, `Product` may now be `Published` per BR-PRD-02) or `Rejects` (with reason, returns to step 2).

This mirrors, and is coupled to, the Product approval workflow (`business-rules.md §4`) — a product is never publishable with an unapproved price.

## 5. Recalculation Triggers

The Marketplace Price must stay current with exchange rate movement (`business.md` core requirement). Recalculation is triggered by:

1. **Exchange Rate Update** — whenever a new `ExchangeRate` record is created (manual entry or, in later phases, an automated FX feed), all `Product`s whose current `ProductPrice` used the superseded rate are queued for recalculation.
2. **Scheduled Sweep** — a background job (see `architecture.md §Background Jobs Strategy`) runs on a configurable interval (assumption: daily) to catch any product whose calculation currency inputs may have drifted (e.g., component costs updated directly) even without an explicit FX trigger.
3. **Manual Trigger** — an Admin may force recalculation of a single product or a whole category (e.g., before a promotional push).

## 6. Auto-Publish vs. Re-Approval Threshold

Per BR-PRC-04:
- If the recalculated `MarketplacePrice` differs from the currently live price by **≤ 5%** (configurable system setting, `PricingEngineOptions.AutoApproveTolerancePercent`), the new `ProductPrice` is auto-approved and becomes current — this is the *only* case where an automated process finalizes a price without a human, and it is intentionally narrow (currency noise, not a business decision).
- If the difference is **> 5%**, the new `ProductPrice` is created with `Status = PendingApproval` and the *previous* approved price remains live/displayed until an Admin acts, so Buyers are never shown an unapproved price and the product is never taken off-sale merely because FX moved.

This threshold and its default value are an explicit assumption (`business.md §11`) pending confirmation from Roseair finance/ops.

## 7. Historical Integrity

- `ProductPrice` rows are append-only (`Status: Superseded` when replaced), never updated in place — this is the audit trail behind BR-PRC-06.
- An `Order`/`OrderLine` stores a **snapshot** of the `UnitPrice` at the moment of purchase (`domain-model.md §2.4`), so subsequent recalculations never alter historical orders or invoices (BR-PRC-05).

## 8. Visibility Rules

| Field | Buyer | Agent (own product) | Admin |
|---|---|---|---|
| SupplierCost | ✗ | ✓ | ✓ |
| Freight / CBM / Pre-shipping / Operational / Insurance | ✗ | ✗ | ✓ |
| Roseair Commission | ✗ | ✗ | ✓ |
| MarketplacePrice | ✓ | ✓ | ✓ |

Enforced at the API/DTO layer (`api-design.md §Response Conventions`) — no endpoint ever serializes cost-component fields to a `Buyer`-scoped response, regardless of query shape (defense against over-fetching via generic endpoints).

## 9. Category-Level Configuration

Commission rate and operational cost rate are expected to vary by `Category` (e.g., electronics vs. solar equipment carry different margins). Modeled as `CategoryPricingProfile` (`CategoryId`, `CommissionPercent` or flat, `OperationalCostPercent` or flat), consulted as the default when Roseair Ops builds a product's price, but always overridable per-product.

## 10. Assumptions

1. Calculation currency is USD; final display currency is MZN. If Roseair sources in RMB/CNY for Chinese agents, an additional CNY→USD (or direct CNY→MZN) rate layer may be needed — flagged for validation.
2. CBM-based freight allocation formula (rate per cubic meter, and how a shared container's cost is apportioned across multiple products/orders) is not specified by the business and requires operational input before implementation; a placeholder linear formula (`CbmAllocation = ProductVolumeCbm × RatePerCbm`) is assumed for MVP.
3. Insurance is optional per product/order and is assumed to default to "not applicable" unless explicitly enabled by Roseair Ops (e.g., above a declared value threshold).
4. No automated FX data provider integration in MVP; rates are entered manually by Admin. Phase 3 candidate: integrate a live FX API (e.g., a central bank or commercial FX feed).

## 11. Relation to Other Documents

- `business-rules.md §5` — governing rules.
- `domain-model.md §2.3` — entity shapes (`ExchangeRate`, `ProductPrice`).
- `database-design.md §Pricing Entities` — persistence and indexing.
- `architecture.md §Background Jobs Strategy` — recalculation sweep implementation.

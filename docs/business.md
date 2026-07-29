# Roseair Marketplace — Business Documentation

## 1. Purpose of This Document

This document defines the business context, business model, actors, value proposition and strategic direction of Roseair Marketplace. It is the foundation from which `business-rules.md`, `domain-model.md`, `pricing-engine.md` and all other technical documents are derived. When a technical decision is ambiguous, this document is the tiebreaker.

## 2. Company Context

Roseair is a logistics and international trade company operating primarily out of Mozambique, facilitating the import of goods (largely sourced from China and other international markets) for Mozambican businesses. Historically this trade has been conducted informally — WhatsApp groups, personal broker relationships, ad-hoc quotations — with no centralized trust layer, no price transparency, and no standardized operational pipeline from purchase to delivery.

Roseair Marketplace is the digitization and formalization of that trade relationship, with Roseair positioned not as a passive listing site but as the **operational and financial control point** of every transaction.

## 3. What Roseair Marketplace Is

Roseair Marketplace is a **Managed B2B Marketplace**. The defining characteristic that separates it from a generic e-commerce platform or a peer-to-peer marketplace (e.g., Alibaba) is that **Roseair supervises and controls the complete purchasing operation end-to-end**:

- Roseair approves every Agent before they can sell.
- Roseair approves every Product before it is published.
- Roseair approves every Price before it is shown to Buyers.
- Roseair is the sole recipient of Buyer payments — funds never move directly from Buyer to Agent.
- Roseair has visibility into every Buyer↔Agent conversation.
- Roseair owns and operates the logistics pipeline (freight, customs clearance, delivery) after a purchase is confirmed.

This is analogous to a marketplace acting simultaneously as: escrow agent, freight forwarder, customs broker, and trust/reputation authority — layered on top of a product catalog and storefront experience.

### 3.1 What Roseair Marketplace Is NOT

- **Not** a generic e-commerce storefront (single-seller, direct-payment model).
- **Not** an Alibaba clone — Alibaba is peer-to-peer with buyer/supplier negotiating and transacting directly; Roseair intermediates every transaction.
- **Not** a quotation/RFQ marketplace. There is no "request a quote and wait for a seller to respond" workflow. Products are pre-priced by the Pricing Engine and purchasable immediately, the same way a normal e-commerce checkout works.
- **Not** a dropshipping platform — Roseair takes operational responsibility for the shipment once payment is confirmed.

> **Decision note (supersedes earlier scaffolding):** an earlier iteration of this project (see `src/docs/docs/*`, `src/pages/AdminQuotesPage.tsx`, `QuoteRequestSuccessPage.tsx`) modeled a **quotation-based** flow (Buyer → Product → Quote Request → Roseair enters the process). This has been explicitly superseded. The current, authoritative business flow (Section 5) has **no quotation step** — products carry a calculated, ready-to-buy Marketplace Price at all times. The quotation-related pages/entities in the existing frontend scaffold are considered legacy and must be reconciled or removed in a future iteration; they are not part of this specification.

## 4. Actors

### 4.1 Buyer
A registered business (or business-acting individual) purchasing products through the marketplace. Buyers browse, search, purchase, pay, track shipments, communicate with Agents, and raise complaints.

### 4.2 Agent
A verified international sourcing partner (today, primarily China-based) responsible for:
- Locating and vetting suppliers for a given product.
- Confirming stock availability and lead time.
- Preparing product listings (subject to Roseair approval).
- Packing and shipping products once an order is confirmed.
- Preparing export/shipping documentation.
- Communicating with Buyers pre- and post-purchase (under Roseair supervision).

Agents are presented publicly as **"Roseair Official Partner"** — the platform's brand equity, not the Agent's own brand, is what is being sold to the Buyer. This is a deliberate trust-transfer mechanism.

### 4.3 Roseair (Platform Operator / Admin)
Roseair is simultaneously the platform owner and an active operational participant. Responsibilities:
- Agent vetting and approval.
- Product review and approval.
- Price calculation/approval via the Pricing Engine.
- Payment custody (all Buyer payments are made **to Roseair**, never directly to Agents).
- Logistics cost calculation (freight, CBM, customs, insurance).
- Supervision of Buyer↔Agent chat.
- Order lifecycle operations: shipment tracking, customs clearance coordination, final-mile delivery.
- Customer trust, dispute resolution, and complaint handling.
- Platform analytics and reporting.

Roseair is not a passive intermediary collecting a listing fee — Roseair is operationally embedded in *every* order from payment through delivery.

## 5. Official Business Flow

```
Marketplace
    ↓
Product Details
    ↓
Purchase
    ↓
Payment
    ↓
Invoice Generation
    ↓
Checkout Confirmation
    ↓
Chat (Buyer ↔ Agent, Roseair monitors)
    ↓
Agent prepares shipment
    ↓
Tracking
    ↓
Arrival at Port
    ↓
Customs Clearance
    ↓
Delivery
```

There is no negotiation/quotation stage inserted into this flow. Product prices are final, calculated, and purchasable at the moment they are published. Chat exists for logistics coordination (specs confirmation, shipping instructions, documentation) — not price negotiation. See `business-rules.md §Communication Rules` for constraints on what chat may be used for.

## 6. Value Proposition by Actor

| Actor | Value Received |
|---|---|
| Buyer | Access to vetted international suppliers with transparent, all-inclusive pricing; payment protection (funds held by a trusted local company, not sent overseas); logistics and customs handled on their behalf; single point of accountability if something goes wrong. |
| Agent | Access to a structured demand channel (Mozambican buyers) without needing to build local trust, handle local payments, or manage customs/logistics themselves. |
| Roseair | Commission on every transaction (embedded in Marketplace Price); control of the logistics/customs/freight value chain (Roseair's core existing business); data on regional import demand. |

## 7. Strategic Objective

Become the reference B2B import marketplace in Mozambique, then expand to Southern Africa (SADC region: South Africa, Zimbabwe, Zambia, Malawi, Botswana, etc.), transforming informal, trust-fragile import trade into a structured, centrally-supervised commerce channel.

## 8. Product Pricing Philosophy (Summary)

The marketplace **never exposes raw supplier cost**. Every price shown to a Buyer is a fully-loaded **Marketplace Price** composed of supplier cost, freight, CBM allocation, pre-shipping costs, operational costs, insurance (when applicable), and Roseair's commission. Because freight cost is a function of currency exchange rates that fluctuate, prices must be able to recompute automatically. This is formalized in `pricing-engine.md`.

## 9. Payments Philosophy

Buyers never pay Agents directly. All payment methods (M-Pesa, e-Mola, Bank Transfer, and future gateways) route funds to Roseair. This is both a trust mechanism (Buyers trust a known local company, not an unknown foreign Agent) and a control mechanism (Roseair cannot lose control of an order once payment starts, since it holds the funds).

## 10. UI / Market Localization

The Buyer- and Agent-facing product must be presented in **Portuguese (Mozambique/Portugal)**, consistent with the target market. This is a UX/localization requirement, not a business rule affecting domain logic, and is documented here for completeness; see `modules.md` for its implementation implications (i18n strategy).

## 11. Assumptions

Where the business description provided did not specify a detail, the following assumptions are made explicit (rather than silently invented). These are candidates for validation with the Roseair business stakeholders:

1. **Currency of transaction**: Buyers pay in MZN (Mozambican Metical); the Pricing Engine converts from a foreign-currency-denominated supplier cost (assumed USD/CNY) to MZN using a maintained exchange rate. *(See `pricing-engine.md §Assumptions`.)*
2. **Buyer identity**: Buyers are businesses (B2B), but the platform does not currently model a multi-user "company account" — each Buyer is assumed to be a single authenticated user acting for a business until a future "Organization" concept is introduced (see `roadmap.md` Phase 4).
3. **Minimum order / MOQ**: Not specified by the business; assumed each product may optionally declare a Minimum Order Quantity, defaulting to 1.
4. **Partial payments**: Not specified; assumed **not supported** in MVP — an order is either fully paid or unpaid. Deposit/installment payment is a Phase 3+ candidate.
5. **Order cancellation**: Not specified; assumed Buyers may request cancellation only before "Payment Confirmed"; after that, cancellation becomes a Complaint/Dispute case handled operationally by Roseair.
6. **Multi-item cart with multiple Agents**: Assumed supported — a single Buyer order may aggregate products from different Agents, but logistics (tracking, delivery) are managed **per Agent-fulfilled shipment**, not per order. This has direct implications for `domain-model.md` (Order vs. Shipment separation).
7. **Refunds**: Not specified; assumed Roseair defines refund policy manually per dispute in MVP (no automated refund engine).
8. **Agent payout**: Not specified how/when Roseair pays the Agent for supplier cost + their margin. Assumed to be an **out-of-platform / manual operational process** in MVP (Roseair finance team), with an in-platform Agent Payout ledger planned for Phase 3.

## 12. Related Documents

- `business-rules.md` — enumerated, enforceable business rules derived from this document.
- `domain-model.md` — entities and relationships that implement this business model.
- `pricing-engine.md` — detailed pricing computation logic.
- `user-flows.md` — flow-by-flow UX/system walkthroughs.
- `roadmap.md` — phased delivery of this business vision.

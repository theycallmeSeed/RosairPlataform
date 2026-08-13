# Linkano Marketplace — Business Rules

This document enumerates the enforceable business rules of the platform. Each rule is written to be directly traceable to a validation, authorization check, or state-machine guard in the backend. Rules are grouped by domain area. Rule IDs are stable identifiers (`BR-<AREA>-<NUM>`) to be referenced from code comments, tests, and PRs.

## 1. Actors & Roles

| Role | Code | Description |
|---|---|---|
| Buyer | `BUYER` | Registered business/individual purchasing goods. |
| Agent | `AGENT` | Verified international sourcing partner. |
| Roseair Admin | `ADMIN` | Roseair staff with operational/approval authority. |
| Roseair Super Admin | `SUPER_ADMIN` | Admin with system configuration and user-management authority (see `permissions.md`). |

- **BR-ACT-01**: A user has exactly one role at a time in MVP. Multi-role accounts (e.g., a Buyer who is also an Agent) are out of scope until Phase 4.
- **BR-ACT-02**: Role is assigned at registration for Buyers (self-service) and Agents (self-service registration, but role is inactive until approved — see §3). Admin accounts are provisioned only by an existing Super Admin.

## 2. Permissions (summary — full matrix in `permissions.md`)

- **BR-PERM-01**: Only `ADMIN`/`SUPER_ADMIN` may approve Agents, approve Products, approve/modify Prices, or view platform-wide analytics.
- **BR-PERM-02**: Agents may create/edit Products belonging only to themselves.
- **BR-PERM-03**: Buyers may view only their own Orders, Invoices, and Chat threads; Agents may view only chat threads and orders in which they are the fulfilling Agent.
- **BR-PERM-04**: `ADMIN` has read visibility into all Chat threads (see §7 Communication Rules) and all Orders regardless of Buyer/Agent.

## 3. Agent Approval Rules

- **BR-AGT-01**: An Agent account cannot list products or receive orders until its status is `Approved`.
- **BR-AGT-02**: Agent approval requires (per business input) verification of: physical company existence, verified market reputation, existing customer references, and market representation in the sourcing country (e.g., China). These are captured as structured `AgentVerificationDocument` records reviewed manually by an Admin (no automated verification in MVP).
- **BR-AGT-03**: Agent application states: `PendingReview → Approved | Rejected`. A `Rejected` Agent may re-apply (creates a new application; history retained).
- **BR-AGT-04**: An `Approved` Agent can be suspended (`Suspended`) by an Admin at any time for policy violations; a suspended Agent's products are automatically unpublished (see BR-PRD-08).
- **BR-AGT-05**: Every Agent is displayed publicly with the badge "Linkano Official Partner" — no Agent-specific branding/storefront that competes with Roseair's brand is permitted in MVP.

## 4. Product Rules

- **BR-PRD-01**: Agents cannot publish products directly. Every product passes through: `Draft → Submitted → UnderReview → (PricingCalculated) → Approved/Rejected → Published`.
- **BR-PRD-02**: A product cannot be `Published` without an associated `Approved` Price computed via the Pricing Engine (see `pricing-engine.md`).
- **BR-PRD-03**: Only `Approved`-status Agents may submit products.
- **BR-PRD-04**: Any edit to a `Published` product's content (title, images, specifications, category) moves it back to `UnderReview` and unpublishes it until re-approved. Cosmetic-only fields (to be enumerated in implementation, e.g., non-pricing descriptive text) MAY be configured as exempt from re-review — default assumption: **no exemptions in MVP**, all edits require re-approval.
- **BR-PRD-05**: Any price modification (supplier cost change, freight change, etc.) requires Admin re-approval before the new price is shown to Buyers. The previously approved price remains live until the new one is approved.
- **BR-PRD-06**: A product must belong to exactly one Category (see `domain-model.md`).
- **BR-PRD-07**: A Rejected product returns to the Agent with a mandatory rejection reason (free text, required field) so the Agent can correct and resubmit.
- **BR-PRD-08**: If an Agent is suspended or their approval revoked, all of their `Published` products are automatically transitioned to `Unpublished` (not deleted) and become non-purchasable.
- **BR-PRD-09**: A product cannot be purchased (added to cart / checked out) unless its status is `Published` at the time of checkout confirmation (re-validated server-side at checkout, not just at add-to-cart, to avoid stale-cart race conditions).

## 5. Pricing Rules

(Full computation logic in `pricing-engine.md`; these are the governing business rules.)

- **BR-PRC-01**: The raw Supplier Cost is never shown to a Buyer, in any UI, API response, invoice, or export, under any role except `ADMIN`/`SUPER_ADMIN` and the owning `AGENT` (who inherently knows their own cost).
- **BR-PRC-02**: Marketplace Price = Supplier Cost + Freight + CBM Allocation + Pre-shipping Costs + Operational Costs + Insurance (if applicable) + Roseair Commission. Each component is individually recorded (not collapsed into a single opaque markup) to support audit and recalculation.
- **BR-PRC-03**: Marketplace Price must be recalculated whenever the governing exchange rate changes beyond a configured threshold (see `pricing-engine.md §Recalculation Triggers`), or on a scheduled interval, whichever comes first.
- **BR-PRC-04**: An automatic price recalculation that changes the customer-facing price by more than a configured tolerance (e.g., >5%) requires Admin re-approval before going live; recalculations within tolerance may auto-publish. *(Assumption — no tolerance value specified by business; default 5%, configurable.)*
- **BR-PRC-05**: A price that is already reflected in a paid Order is immutable for that Order — price changes never retroactively affect confirmed purchases.
- **BR-PRC-06**: Every price change is versioned (append-only `PriceHistory`), never destructively overwritten, to support audit and dispute resolution.

## 6. Payment Rules

- **BR-PAY-01**: All payments are made to Roseair. No payment flow, method, or integration may transfer funds directly from Buyer to Agent.
- **BR-PAY-02**: Supported payment methods in MVP: M-Pesa, e-Mola, Bank Transfer. The payment subsystem must be designed so additional gateways can be added without core domain changes (see `architecture.md §Payment Strategy`).
- **BR-PAY-03**: An Order does not proceed past `PendingPayment` until payment is confirmed (either synchronously for instant methods like M-Pesa/e-Mola, or manually reconciled for Bank Transfer — see BR-PAY-05).
- **BR-PAY-04**: An Invoice is generated only after a successful purchase action, and always precedes/accompanies Payment Confirmation in the flow (Purchase → Payment → Invoice Generation → Checkout Confirmation, per `business.md §5`). Interpretation: the invoice is generated at the point of purchase intent (pro-forma) and finalized once payment clears.
- **BR-PAY-05**: Bank Transfer payments require manual confirmation by an Admin (proof-of-payment upload + reconciliation), since bank rails have no real-time confirmation API in MVP.
- **BR-PAY-06**: Partial payments are not supported in MVP (see `business.md §11.4`). An order is Unpaid or Paid in full.
- **BR-PAY-07**: No refund is processed automatically; refunds are an Admin-initiated manual operation tied to a Complaint/Dispute record (see §9).

## 7. Communication (Chat) Rules

- **BR-CHT-01**: A Chat thread is created automatically once an Order (or Order line fulfilled by a given Agent) reaches `Payment Confirmed`. Buyers cannot chat with an Agent before purchase (no pre-sales negotiation channel) — consistent with "no quotation workflow."
- **BR-CHT-02**: Every message in every Buyer↔Agent thread is visible to `ADMIN` role (full read access, real-time or near-real-time). This is a supervisory, not merely audit-log, capability.
- **BR-CHT-03**: Chat is scoped to logistics/order coordination (specifications confirmation, shipping instructions, documentation exchange). Price negotiation or off-platform payment solicitation is a policy violation, subject to future automated moderation (Phase 3+ — flagged for human moderation in MVP via Complaint/Report mechanism, not automatically blocked).
- **BR-CHT-04**: Chat threads are permanently retained (no deletion) for dispute-resolution and audit purposes.

## 8. Order Lifecycle Rules

Order status values, in sequence:

```
PendingPayment → PaymentConfirmed → PreparingShipment → Shipped →
TrackingActive → ArrivedAtPort → CustomsClearance → Delivered
```

Additional terminal/exception states: `Cancelled`, `Disputed`.

- **BR-ORD-01**: Transitions are strictly forward along the defined sequence; no skipping stages, enforced by a state machine (see `domain-model.md §Order Aggregate`).
- **BR-ORD-02**: `Cancelled` is only reachable from `PendingPayment` (Buyer- or system-initiated, e.g. payment timeout) or by explicit Admin override at any stage (operational exception, logged with reason).
- **BR-ORD-03**: `Disputed` is reachable from any stage at or after `PaymentConfirmed`, triggered by a Complaint linked to the order (see §9), and does not remove the order from its logistics pipeline — it is a parallel flag, not a replacement of the underlying status, unless Admin explicitly halts fulfillment.
- **BR-ORD-04**: An Order containing items from multiple Agents is tracked as one Order with multiple child `Shipment` records, one per fulfilling Agent; overall Order status is derived from the least-advanced Shipment status (assumption, §business.md 11.6).
- **BR-ORD-05**: Every status transition is timestamped and attributed (system/user) to support the Tracking UI and reporting (`Sales per Agent`, `Orders` reports).

## 9. Complaint / Dispute Rules

- **BR-CMP-01**: Every Complaint must reference exactly one Order (no free-floating complaints unrelated to an order in MVP; general customer support inquiries are handled as a separate "Support Ticket" concept — see `roadmap.md` Phase 2).
- **BR-CMP-02**: Complaint types: `Complaint` (service/quality issue), `Dispute` (financial/order-content disagreement requiring resolution decision), `Report` (policy violation report, e.g. against an Agent or chat content).
- **BR-CMP-03**: Complaint states: `Open → InReview → Resolved | Rejected`. Only `ADMIN` may transition out of `InReview`.
- **BR-CMP-04**: Any Complaint of type `Dispute` places the associated Order's `Disputed` flag to `true` (BR-ORD-03) until resolved.
- **BR-CMP-05**: A Buyer and the fulfilling Agent are both notified of Complaint status changes; both may add evidence/comments while `Open` or `InReview`.

## 10. Tracking Rules

- **BR-TRK-01**: Tracking data is entered/updated by the Agent (shipment creation, tracking number) and by Roseair operations (port arrival, customs clearance, delivery confirmation).
- **BR-TRK-02**: Each Shipment maintains an append-only `TrackingEvent` log (status + timestamp + optional note/location), independent of the coarse `Order.Status`, to support a detailed Buyer-facing tracking timeline.
- **BR-TRK-03**: Customs Clearance is a distinct, Roseair-owned stage — Agents have no visibility or write-access into customs data beyond seeing that the stage is in progress.

## 11. Validation Rules (cross-cutting)

- **BR-VAL-01**: All monetary values are stored as `decimal` with an explicit currency code; no floating-point money.
- **BR-VAL-02**: All entities affecting financial calculation (Product price components, Order totals, Invoice amounts) are immutable once linked to a confirmed transaction; corrections happen via new versioned records, never in-place mutation.
- **BR-VAL-03**: Required-approval workflows (Agent, Product, Price) always require a human Admin action; none are ever auto-approved in MVP, even if a rule "would" pass — automation may pre-screen but not finalize approval (assumption, conservative default given "Roseair supervises" as a core value prop).

## 12. Future Expansion Rules (documented intent, not enforced in MVP)

- **BR-FUT-01**: Multi-currency Buyer-facing pricing (display in USD/ZAR in addition to MZN) — Phase 4.
- **BR-FUT-02**: Automated chat moderation (keyword/policy detection for off-platform solicitation) — Phase 3.
- **BR-FUT-03**: Partial/installment payments — Phase 3+, pending Roseair finance policy definition.
- **BR-FUT-04**: In-platform Agent payout ledger and automated commission settlement — Phase 3.
- **BR-FUT-05**: Organization/multi-user Buyer accounts (company-level access with sub-users and spend limits) — Phase 4.
- **BR-FUT-06**: Automated/rule-based Price approval for low-risk recalculations — Phase 3, pending defined risk thresholds from Roseair.

## 13. Traceability

Every rule above must have a corresponding automated test once implemented. Rule IDs should appear in commit messages / PR descriptions / test names when a change affects that rule (e.g., `BR-PRC-03`).

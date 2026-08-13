# Linkano Marketplace — Modules

This document describes each functional module of the platform from a product/feature perspective (complementing `system-design.md`, which describes the same modules from a technical/architectural perspective). It is the map between what a user sees and does, and the bounded context that implements it.

## 1. Identity & Access

**Purpose**: Registration, authentication, role management, Agent verification intake.

**Key features**: Buyer registration, Agent registration + document upload, login/logout, password reset, JWT session management, profile management.

**Consumers**: All roles.

## 2. Catalog

**Purpose**: Product listing, categorization, Agent product management, Admin review queue.

**Key features**: Category browse, product search/filter, product detail page, Agent "my products" dashboard (Draft/Submitted/UnderReview/Published/Rejected views), Admin product review queue, approve/reject with reason.

**Consumers**: Buyer (browse/search), Agent (manage), Admin (review/approve).

## 3. Pricing Engine

**Purpose**: Compute, version, and govern the Marketplace Price of every product; react to exchange-rate changes.

**Key features**: Cost-component entry (Roseair Ops), exchange rate management, automatic recalculation sweep, approval workflow for price changes, price history/audit view.

**Consumers**: Admin/Roseair Ops (primary), Agent (limited visibility — own supplier cost + final price), Buyer (sees only final price, indirectly via Catalog).

Detailed in `pricing-engine.md`.

## 4. Marketplace / Storefront (Buyer-facing composition of Catalog + Pricing)

**Purpose**: The Buyer's entry point and primary shopping experience — this is the homepage. `business.md §5` (Official Business Flow) begins the canonical flow directly at "Marketplace," with no landing-page step preceding it, which is the authoritative basis for treating the homepage as the Marketplace itself.

**Key features**: Search-first homepage, category navigation, rich product cards (image, price, trust badges — "Linkano Official Partner"), product detail page, related products.

## 5. Cart & Checkout

**Purpose**: Buyer product selection and purchase initiation.

**Key features**: Multi-item, potentially multi-Agent cart; checkout flow validating product availability/price at confirmation time (BR-PRD-09); order creation.

## 6. Payments

**Purpose**: Collect and confirm Buyer payment, always to Roseair.

**Key features**: M-Pesa, e-Mola, Bank Transfer flows; payment status tracking; manual reconciliation queue (Bank Transfer) for Admin; invoice generation.

## 7. Ordering & Fulfillment

**Purpose**: Order lifecycle management from payment confirmation through delivery.

**Key features**: Order status pipeline, multi-Agent shipment splitting, Agent "prepare shipment" workflow, Admin operational override.

## 8. Logistics & Tracking

**Purpose**: Shipment tracking visibility for Buyers; operational tracking-event entry for Agents/Roseair.

**Key features**: Tracking timeline (port arrival, customs clearance, delivery), carrier/tracking number capture, customs clearance stage (Roseair-owned).

## 9. Communication (Chat)

**Purpose**: Post-purchase Buyer↔Agent coordination, fully supervised by Roseair.

**Key features**: Order-scoped chat thread, real-time (SignalR, Phase 2+) or polling (MVP) messaging, attachments, Admin read-all supervisory view.

## 10. Support (Complaints, Disputes, Reports)

**Purpose**: Order-linked issue resolution.

**Key features**: Raise complaint/dispute/report, comment thread, Admin resolution workflow, dispute flag on Order.

## 11. Notifications

**Purpose**: Keep Buyers/Agents informed of state changes (order status, chat messages, complaint updates, approval decisions) without requiring active polling.

**Key features**: In-app notification center (MVP); email/SMS/push channels (Phase 2+, given M-Pesa/e-Mola SMS-adjacent user base, SMS notification is a strong regional fit — flagged as a Phase 2 priority candidate, not formally scoped by the business input).

## 12. Admin Console

**Purpose**: Roseair's operational control center — the practical expression of "Roseair supervises everything."

**Key features**: Agent approval queue, Product approval queue, Pricing approval queue, Order management, Payment reconciliation, Complaint resolution, Analytics dashboard, platform configuration (categories, pricing profiles, exchange rates).

## 13. Analytics & Reporting

**Purpose**: Business intelligence for Roseair leadership/operations.

> **Documentation note**: earlier drafts of this section cited `business.md §"Reporting"` as the source for the metric list below. `business.md` has no section by that name (its §6 is "Value Proposition by Actor") and contains no dedicated reporting/analytics section — that citation was never valid and has been removed. The metric list has instead been traced against the two documents that actually define MVP/Phase-2 analytics scope:

**Key features**:
- **Grounded in `mvp.md §3` (MVP baseline scope)**: Daily Sales, Monthly Sales, Orders, Products, Complaints.
- **Grounded in `roadmap.md` Phase 2 ("Operational")**: Sales per Agent, Top Products, Top Agents, Traffic Sources, Conversion.
- **Not grounded in any current document — documentation gap, not resolved here**: Visitors, Revenue, Payments. These three appear in this list with no corresponding definition, scope note, or Phase assignment anywhere in `docs/`, including the `daily_sales_snapshots` / `agent_performance_snapshots` / `product_performance_snapshots` / `traffic_snapshots` tables in `database-design.md §2.8` (none of which name a "visitors," "revenue," or "payments" metric explicitly). They are left in the list as a flagged gap rather than removed (removing them would silently drop a requirement) or given an invented source.

Admin-only visibility (carried forward from prior project scaffolding decision, `src/docs/docs/project-context.md`, reaffirmed here as still applicable — no business input contradicted it).

## 14. Localization (i18n)

**Purpose**: Deliver the Buyer/Agent-facing UI in Portuguese (Mozambique/Portugal), per prior established direction (`src/docs/docs/project-context.md`), consistent with the target market described in `business.md`.

**Implementation implication**: frontend uses a resource-based i18n strategy (e.g., `react-i18next` or equivalent) from day one rather than hardcoded strings, even though only one locale ships initially — this keeps future SADC-region locale expansion (`business.md §7`) low-cost. Backend API remains locale-agnostic (English field names, structured error codes translated client-side), per `architecture.md`/`api-design.md` conventions — the API is not responsible for UI text.

## 15. Module-to-Bounded-Context Cross-Reference

| Product Module | Bounded Context(s) (`domain-model.md §1`) |
|---|---|
| Identity & Access | Identity & Access |
| Catalog | Catalog |
| Pricing Engine | Pricing |
| Marketplace/Storefront | Catalog + Pricing (read-composed) |
| Cart & Checkout | Ordering |
| Payments | Payments |
| Ordering & Fulfillment | Ordering, Logistics & Tracking |
| Logistics & Tracking | Logistics & Tracking |
| Communication | Communication |
| Support | Support |
| Notifications | cross-cutting (event consumer of all contexts) |
| Admin Console | composition of all contexts (authorization-gated views) |
| Analytics & Reporting | Analytics |

## 16. Related Documents

- `system-design.md` — technical module architecture.
- `user-flows.md` — step-by-step flows through these modules.
- `roadmap.md` / `development-roadmap.md` — phased delivery of these modules.

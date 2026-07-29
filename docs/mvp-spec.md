# Roseair Marketplace — MVP Functional Specification

This is the functional/screen-level companion to `mvp.md`. It supersedes the earlier quotation-based scaffold (`src/docs/mvp-spec.md`, `src/docs/docs/*`) — the authoritative flow has **no quotation step**; products are purchasable at a calculated price immediately (`business.md §3.1 decision note`).

## 1. Buyer Flow

```
Marketplace (Homepage)
    ↓
Product Details
    ↓
Cart
    ↓
Checkout
    ↓
Payment (M-Pesa / e-Mola / Bank Transfer)
    ↓
Invoice
    ↓
Checkout Confirmation
    ↓
Chat (Buyer ↔ Agent, Roseair supervises)
    ↓
Order Tracking (Shipped → Arrived at Port → Customs Clearance → Delivered)
    ↓
(optional) Complaint
```

Screens: Marketplace/Homepage, Product Details, Cart, Checkout, Payment, Invoice, Order Confirmation, Order History, Order Detail/Tracking, Chat, Complaint Form, Notifications, Buyer Profile/Purchase History.

## 2. Agent Flow

```
Registration + Verification Documents
    ↓
(Roseair Approval)
    ↓
Agent Dashboard
    ↓
Add Product (Draft, enter SupplierCost)
    ↓
Submit Product
    ↓
(Roseair pricing + approval)
    ↓
Published — visible on Marketplace
    ↓
Receive Orders
    ↓
Chat with Buyer
    ↓
Prepare Shipment (enter tracking number/carrier)
    ↓
Monitor delivery through completion
```

Screens: Agent Registration, Document Upload, Agent Dashboard (products by status), New/Edit Product form, Order Queue, Shipment Preparation, Chat, Agent Profile.

## 3. Admin Flow

```
Admin Login
    ↓
Admin Dashboard
    ↓
Approve/Reject Agents
    ↓
Review/Price/Approve Products
    ↓
Manage Exchange Rates
    ↓
Manage Orders (view, cancel/override)
    ↓
Reconcile Bank Transfer Payments
    ↓
Update Tracking Events (port, customs, delivery)
    ↓
Monitor Chat (supervisory)
    ↓
Resolve Complaints/Disputes
    ↓
View Analytics
```

Screens: Admin Login, Admin Dashboard (overview), Agent Approval Queue, Product Review Queue, Pricing Management (exchange rates, cost entry, price approval), Order Management, Payment Reconciliation Queue, Tracking Management, Chat Supervision View, Complaint Management, Analytics Dashboard.

## 4. Core Entities (MVP)

Aligned with `domain-model.md` (authoritative — this is the plain-language summary):

`User`, `AgentProfile`, `BuyerProfile`, `AgentVerificationDocument`, `Category`, `Product`, `ProductImage`, `ExchangeRate`, `ProductPrice`, `Cart`, `CartLine`, `Order`, `OrderLine`, `Shipment`, `TrackingEvent`, `PaymentTransaction`, `Invoice`, `ChatThread`, `ChatMessage`, `Complaint`, `ComplaintComment`.

Removed from the earlier scaffold's entity list as no longer applicable: `QuoteRequest` (no quotation workflow), `Warehouse`/`AnalyticsMetric` as first-class MVP entities (warehousing is not described in the current business input as a Roseair-operated facility in the buyer-facing flow; Analytics in MVP is direct-query, not a persisted metric entity — see `mvp.md §4`). If Roseair operates physical warehousing as part of the import pipeline, this should be raised explicitly and added to `domain-model.md` rather than assumed.

## 5. Frontend Scaffold Reconciliation

The existing `src/pages` scaffold (`AdminQuotesPage.tsx`, `QuoteRequestSuccessPage.tsx`) reflects the superseded quotation model and must be reconciled against this spec before/while implementing the backend described in `architecture.md` and `api-design.md`:

| Existing Page | Disposition |
|---|---|
| `LandingPage.tsx` | Remove or repurpose — Homepage IS the Marketplace (`business.md §6`), no separate corporate landing page. |
| `MarketplacePage.tsx` | Keep — becomes the homepage. |
| `ProductDetailsPage.tsx` | Keep — must show only Marketplace Price, never cost breakdown. |
| `AdminQuotesPage.tsx` | Remove/replace with Order Management + Payment Reconciliation views. |
| `QuoteRequestSuccessPage.tsx` | Remove/replace with Checkout Confirmation. |
| `AgentApprovalPage.tsx` | Keep — maps directly to Agent Approval Queue. |
| `AgentDashboardPage.tsx`, `AgentNewProductPage.tsx` | Keep — align field set to `domain-model.md §2.2` (remove any quotation-specific fields). |
| `AdminDashboardPage.tsx`, `AnalyticsDashboardPage.tsx` | Keep — align to MVP Analytics scope (`mvp.md §3`). |
| `BuyerDashboardPage.tsx` | Keep — becomes Order History / Purchase History. |

This reconciliation is a frontend implementation task, not a documentation change, and is called out here so it isn't missed when backend implementation begins.

## 6. Strategic Objective (carried forward, reaffirmed)

Transform informal, trust-fragile import trade into structured commerce centrally supervised by Roseair — consistent with `business.md §7`.

## 7. Related Documents

- `mvp.md` — scope boundary and rationale.
- `domain-model.md` — authoritative entity definitions.
- `user-flows.md` — detailed system-level flow diagrams.
- `roadmap.md` / `development-roadmap.md` — what comes after MVP.

# Linkano Marketplace — MVP Functional Specification

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

This section has three layers, kept distinct rather than collapsed into one: what the **original MVP structure** looked like when this reconciliation was first written, what the **subsequent implementation/reconciliation** did about it, and what the **current structure** actually is (verified by direct inspection of `src/pages` and `src/app/router.tsx` in the present repository). Nothing below is erased from the original record — the original plan is preserved as-written, with status added alongside it.

### 5.1 Original MVP Structure (as originally specified)

At the time this document was written, `src/pages` still carried scaffolding from an earlier, superseded quotation-based flow (`business.md §3.1` decision note): `LandingPage.tsx`, `AdminQuotesPage.tsx`, `QuoteRequestSuccessPage.tsx`. The original reconciliation plan was:

| Existing Page (original) | Disposition (original plan) |
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

### 5.2 Subsequent Implementation / Reconciliation (what happened)

The frontend was subsequently rebuilt/reconciled against this plan. Confirmed by direct inspection of the current repository (`src/pages/`, `src/app/router.tsx`):

- `LandingPage.tsx`, `AdminQuotesPage.tsx`, and `QuoteRequestSuccessPage.tsx` were removed — none of the three exists in the current repository.
- `MarketplacePage.tsx` is wired as the homepage (`router.tsx`: `path: "/"`).
- A `CatalogPage.tsx` was introduced (`/marketplace`) that did not exist in the original plan — it splits "discovery" (homepage) from "search everything" (catalog), a refinement of, not a contradiction to, the original disposition.
- `CheckoutConfirmationPage.tsx` exists and fulfils the "replace `QuoteRequestSuccessPage.tsx`" disposition.
- `AdminOrdersPage.tsx` exists and fulfils the "Order Management" half of the `AdminQuotesPage.tsx` replacement.
- `AgentApprovalPage.tsx`, `AgentDashboardPage.tsx`, `AgentNewProductPage.tsx`, `AdminDashboardPage.tsx`, `AnalyticsDashboardPage.tsx`, `BuyerDashboardPage.tsx` all still exist, matching their "Keep" dispositions.
- `AdminProductReviewPage.tsx` exists (not named in the original table) as the Product Review Queue referenced elsewhere in this document (§3).

### 5.3 Current Structure — Status vs. Original Disposition

| Original Page | Current Equivalent | Status |
|---|---|---|
| `LandingPage.tsx` | — (removed) | **Done** — no separate landing page; homepage is the Marketplace. |
| `MarketplacePage.tsx` | `MarketplacePage.tsx` (`/`) | **Done**. |
| `ProductDetailsPage.tsx` | `ProductDetailsPage.tsx` (`/product/:id`) | **Done** as far as documentation review can confirm — shows a single final price, no cost-breakdown fields present. |
| `AdminQuotesPage.tsx` | `AdminOrdersPage.tsx` (`/admin/orders`) | **Partially done.** Order Management exists. A dedicated **Payment Reconciliation** view (Bank Transfer manual reconciliation, `BR-PAY-05`) does not exist anywhere in the current frontend — this half of the original disposition was not carried out and remains open. |
| `QuoteRequestSuccessPage.tsx` | `CheckoutConfirmationPage.tsx` (`/checkout/confirmation`) | **Done**. |
| `AgentApprovalPage.tsx` | `AgentApprovalPage.tsx` (`/admin/agents`) | **Done**. |
| `AgentDashboardPage.tsx`, `AgentNewProductPage.tsx` | Same names/routes | **Done** — no quotation-specific fields found in the current Agent product data shape. |
| `AdminDashboardPage.tsx`, `AnalyticsDashboardPage.tsx` | Same names/routes | **Partially done.** Both pages exist and render. `AdminDashboardPage.tsx` is unchanged in scope. `AnalyticsDashboardPage.tsx`'s alignment to "MVP Analytics scope" (`mvp.md §3`: Daily/Monthly Sales, Orders, Products, Complaints computed from real transactional data) is not yet achieved — it currently computes over the static product catalog, not over real orders. This is a backend/data-wiring gap, not a page that's missing. |
| `BuyerDashboardPage.tsx` | `BuyerDashboardPage.tsx` (`/buyer`) | **Done** — functions as Order History / Purchase History (orders + saved products). |

This reconciliation remains, as originally noted, primarily a **frontend implementation task** — the documentation update here only records that it was carried out and where it still falls short (Payment Reconciliation view; Analytics on real data), so these two gaps aren't lost when backend implementation begins.

## 6. Strategic Objective (carried forward, reaffirmed)

Transform informal, trust-fragile import trade into structured commerce centrally supervised by Roseair — consistent with `business.md §7`.

## 7. Related Documents

- `mvp.md` — scope boundary and rationale.
- `domain-model.md` — authoritative entity definitions.
- `user-flows.md` — detailed system-level flow diagrams.
- `roadmap.md` / `development-roadmap.md` — what comes after MVP.

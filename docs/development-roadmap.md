# Roseair Marketplace — Development Roadmap

This is the **engineering execution** companion to `roadmap.md`. It sequences technical delivery within Phase 1 (MVP) at a level useful for sprint planning, and outlines the technical entry criteria for Phases 2–4. It assumes the architecture defined in `architecture.md` and the domain in `domain-model.md`.

## Guiding Sequencing Principle

Build **bottom-up through the dependency graph** in `system-design.md §6`: Identity → Catalog → Pricing → Ordering → Payments → Logistics/Chat/Support → Analytics. Each module should be deliverable with automated tests before the next module's use cases depend on it, since later modules genuinely depend on earlier ones (an Order cannot exist without a Product; a Product cannot be Published without a Price).

## Milestone 0 — Foundation

- Solution scaffold per `architecture.md §2` folder structure (Domain/Application/Infrastructure/Api projects + test projects).
- PostgreSQL + EF Core wired up, base `RoseairDbContext`, migration pipeline established.
- Serilog logging, global exception-handling middleware, health check endpoint.
- JWT auth scaffolding (login/refresh), base `User` entity, role-based authorization policies.
- Swagger configured, CI pipeline running build + tests on PR.

## Milestone 1 — Identity & Access

- `User`, `AgentProfile`, `BuyerProfile`, `AgentVerificationDocument`.
- Registration (Buyer, Agent), login, document upload (blob storage).
- Admin: Agent approval queue (approve/reject/suspend).
- **Exit criteria**: an Agent can register and be approved by an Admin end-to-end via API (Swagger-testable), covered by integration tests.

## Milestone 2 — Catalog

- `Category`, `Product`, `ProductImage`.
- Agent product CRUD + submit; Admin review queue (approve/reject).
- Public marketplace browse/search/filter endpoints (Published only).
- **Exit criteria**: full Product lifecycle `Draft → Submitted → UnderReview → Approved → Published` works, but a product cannot yet reach `Published` without Milestone 3 (price approval) — build Milestone 2 and 3 in tandem or accept a temporary bypass flag for isolated testing.

## Milestone 3 — Pricing Engine

- `ExchangeRate`, `ProductPrice`, `CategoryPricingProfile`.
- Cost-component entry, computation service (`pricing-engine.md §3`), approval workflow.
- Recalculation sweep background job + tolerance-based auto-approve logic.
- **Exit criteria**: a submitted Product can be fully priced and approved, unblocking `Published` status; recalculation sweep verified against a simulated FX rate change in tests.

## Milestone 4 — Cart & Ordering

- `Cart`, `CartLine`, `Order`, `OrderLine`, `Shipment` (without tracking yet).
- Checkout flow with re-validation (BR-PRD-09), order state machine (BR-ORD-01) with guard tests for every illegal transition.
- **Exit criteria**: a Buyer can add Published products to cart and complete checkout, producing a `PendingPayment` Order with correctly split Shipments per Agent (BR-ORD-04).

## Milestone 5 — Payments

- `PaymentTransaction`, `Invoice`.
- M-Pesa + e-Mola gateway integration (sandbox first), Bank Transfer manual reconciliation flow.
- Payment confirmation advances Order to `PaymentConfirmed`; invoice finalization.
- **Exit criteria**: all three payment methods functional against sandbox/test credentials; Order correctly transitions on confirmation; invoice PDF/record generated.

## Milestone 6 — Logistics & Tracking

- `TrackingEvent`, Shipment status transitions (`PreparingShipment → ... → Delivered`).
- Agent "mark shipped" + tracking number entry; Admin tracking-event entry (port/customs/delivery).
- **Exit criteria**: Buyer-facing tracking timeline reflects real Shipment/TrackingEvent data through Delivered.

## Milestone 7 — Communication (Chat)

- `ChatThread`, `ChatMessage`, `ChatMessageRead`.
- Auto-creation on `PaymentConfirmed`; polling-based message endpoints (MVP; SignalR deferred to Phase 2).
- Admin read-all supervisory query.
- **Exit criteria**: Buyer and Agent can exchange messages on a confirmed order; Admin can view any thread.

## Milestone 8 — Support (Complaints)

- `Complaint`, `ComplaintComment`.
- Raise/comment/resolve flow, `Order.IsDisputed` flag wiring.
- **Exit criteria**: full complaint lifecycle testable end-to-end, dispute flag correctly set/cleared.

## Milestone 9 — Admin Console & Analytics (MVP scope)

- Consolidated Admin views across all approval queues + operational actions already built in prior milestones.
- Analytics MVP: Daily/Monthly Sales, Orders, Products, Complaints counts — direct queries against transactional tables (no dedicated read-model yet, per `architecture.md §4`).
- **Exit criteria**: Admin can operate the entire platform (approvals, reconciliation, tracking updates, complaint resolution) without direct DB access, and view baseline reporting.

## Milestone 10 — Hardening & MVP Launch Readiness

- Security review (auth, authorization coverage against `permissions.md` matrix, secrets management).
- Load/perf sanity pass on marketplace browse/search (the highest-traffic path).
- Error handling / RFC7807 conformance pass across all endpoints.
- Swagger completeness review (every endpoint documented with required roles).
- Seed data / demo data script for stakeholder review.

## Entry Criteria for Phase 2 (Operational)

- Phase 1 milestones complete and in production with real transactions.
- Observed operational pain points from real Admin usage (chat polling latency, manual FX entry burden, notification gaps) validated against the Phase 2 backlog in `roadmap.md` before committing sprint capacity — don't build Phase 2 speculatively ahead of real usage signal.

## Entry Criteria for Phase 3 / Phase 4

- Defined at the start of each phase based on actual Phase 1–2 operational data (transaction volume, dispute rate, Agent count, regional demand signals) rather than fixed in advance — `roadmap.md` describes intent and direction, not committed dates.

## Related Documents

- `roadmap.md` — business-level phase goals.
- `mvp.md` / `mvp-spec.md` — precise MVP scope boundary.
- `architecture.md` — technical foundation these milestones build on.

# Roseair Marketplace — Product Roadmap

This document describes the **business/product** phasing of Roseair Marketplace. For the corresponding engineering execution plan (sprints, technical milestones), see `development-roadmap.md`. For the precise MVP scope boundary, see `mvp.md` and `mvp-spec.md`.

## Phase 1 — MVP

**Goal**: Prove the core managed-marketplace loop end-to-end for a single market (Mozambique) with real payments and real Roseair supervision, minimum viable breadth.

- Buyer registration, browse, search, purchase, payment (M-Pesa, e-Mola, Bank Transfer), invoice.
- Agent registration, verification document upload, manual Admin approval.
- Product submission → Roseair pricing → approval → publish.
- Pricing Engine v1 (manual cost-component entry, manual exchange rate entry, tolerance-based auto-approve).
- Order lifecycle through Delivered, single happy-path (no advanced exception tooling beyond basic Admin cancel/override).
- Chat (Buyer↔Agent, Admin read-all) — polling-based, not real-time.
- Basic Tracking timeline.
- Basic Complaints (raise/resolve, no SLA tooling).
- Admin Console covering all approval queues + basic Analytics (Daily/Monthly Sales, Orders, Products, Complaints).
- Portuguese-only UI.

**Explicitly out of scope for Phase 1**: real-time chat (SignalR), SMS/push notifications, automated FX feed, multi-currency display, Agent payout ledger, advanced fraud/moderation tooling, mobile app, multi-role accounts.

## Phase 2 — Operational

**Goal**: Harden the platform for real operational load and reduce manual Admin toil.

- Real-time Chat via SignalR.
- Notification channels beyond in-app (SMS given regional fit with M-Pesa/e-Mola user base; email).
- Redis distributed caching; horizontal API scaling.
- Dedicated background worker process for Pricing recalculation + notifications.
- Improved Analytics (Sales per Agent, Top Products, Top Agents, Traffic Sources, Conversion) with a proper Analytics read-model.
- Architecture tests (module boundary enforcement) as team grows.
- Generic audit log table for admin actions.
- Finer-grained Admin sub-roles (Ops/Finance/Support) if team size justifies it.
- Product search improvement (PostgreSQL trigram/full-text).

## Phase 3 — Production Scale

**Goal**: Operate as a trusted, resilient production platform with expanded financial and moderation capability.

- Live FX rate API integration (replacing manual entry).
- Automated/rule-based low-risk price approval expansion.
- Automated chat moderation (policy/keyword detection flagged for human review).
- Partial/installment payments (pending Roseair finance policy).
- In-platform Agent payout ledger and commission settlement tracking.
- Additional payment gateway integrations.
- Docker + managed cloud deployment (Azure/AWS), CI/CD pipeline maturity.
- Webhook support for external system integration (e.g., Roseair ERP).
- Support Ticket concept generalized beyond order-linked complaints.

## Phase 4 — Scaling (Regional Expansion)

**Goal**: Extend beyond Mozambique into the broader SADC region and support larger, more complex buyer organizations.

- Multi-currency Buyer-facing pricing.
- Organization/multi-user Buyer accounts (company-level access, sub-users, spend limits).
- Multi-role accounts (e.g., a user who is both Buyer and Agent).
- Service extraction of Pricing Engine and/or Analytics (per `system-design.md §5`) if load justifies it.
- Additional locale support beyond Portuguese.
- Mobile application (React Native, per prior scaffolding direction).
- Regional logistics/customs variation support (per-country clearance rules).

## Cross-Phase Principle

Every phase preserves the non-negotiable core of the business model (`business.md §3`): Roseair remains the operational and financial intermediary of every transaction. No phase introduces direct Buyer↔Agent payment or unsupervised product publishing — expansion adds capability and scale, never removes control.

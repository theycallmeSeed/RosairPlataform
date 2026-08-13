# Linkano Marketplace — MVP Definition

## 1. Purpose

Defines the precise boundary of what is, and is not, included in the Minimum Viable Product (Phase 1, `roadmap.md`). This is the scope contract for `development-roadmap.md` Milestones 0–10. `mvp-spec.md` provides the functional/screen-level detail; this document provides the scope rationale and boundary list.

## 2. MVP Objective

Prove, with real users and real money, that the core managed-marketplace loop works end-to-end in Mozambique:

> A verified Agent can list a product; Roseair can price and approve it; a Buyer can find it, pay for it (via a real local payment method), coordinate its shipment through a supervised chat, track it, and receive it — with Roseair in operational and financial control at every step.

If this loop works reliably for a modest volume of real transactions, the MVP has succeeded.

## 3. In Scope

- Three roles: Buyer, Agent, Admin (SuperAdmin exists as a technical distinction but MVP does not require multiple Admin permission tiers — one Admin role suffices operationally, `permissions.md §4`).
- Agent registration + document-based manual verification/approval.
- Product submission → Roseair pricing → approval → publish workflow, full state machine (`business-rules.md §4`).
- Pricing Engine v1: manual cost-component entry, manual exchange rate entry, tolerance-based auto-approve for small FX-driven deltas (`pricing-engine.md`).
- Marketplace homepage: search, categories, product cards, product detail (Alibaba-inspired density/structure, not visual clone).
- Cart, checkout, multi-Agent order splitting.
- Payments: M-Pesa, e-Mola (gateway-integrated), Bank Transfer (manual reconciliation).
- Invoice generation.
- Order lifecycle through Delivered; Admin operational cancel/override.
- Chat (Buyer↔Agent, order-scoped, Admin read-all) — polling-based.
- Tracking timeline (Shipment + TrackingEvent), including Customs Clearance as a distinct stage.
- Complaints (raise, comment, resolve), Dispute flag on Order.
- Admin Console: all approval queues, payment reconciliation, tracking updates, complaint resolution.
- Baseline Analytics: Daily Sales, Monthly Sales, Orders, Products, Complaints (direct-query, not a dedicated read-model).
- Portuguese-only UI.

## 4. Out of Scope for MVP

| Item | Reason / Target Phase |
|---|---|
| Real-time chat (SignalR) | Polling is sufficient to validate the loop; real-time is a UX refinement — Phase 2 |
| SMS/push/email notifications | In-app notification sufficient for MVP validation — Phase 2 |
| Automated FX feed | Manual entry acceptable at MVP transaction volume — Phase 3 |
| Multi-currency display | Single-market (MZN) MVP — Phase 4 |
| Agent payout ledger (in-platform) | Manual finance-team process acceptable at MVP volume — Phase 3 |
| Automated chat moderation | Manual Admin supervision sufficient at MVP volume — Phase 3 |
| Partial/installment payments | No defined business policy yet — Phase 3+ |
| Full Analytics suite (Sales per Agent, Top Products/Agents, Traffic, Conversion) | Requires a proper read-model to scale; baseline metrics suffice to validate MVP — Phase 2 |
| Mobile app | Web-first validates the loop faster — Phase 4 |
| Multi-role / Organization accounts | Adds significant complexity not needed to prove the core loop — Phase 4 |
| Additional locales | Single target market at MVP — Phase 4 |
| Service extraction (Pricing/Analytics as separate services) | Modular monolith is sufficient at MVP scale — Phase 4 (conditional on actual load) |

## 5. Success Criteria

- End-to-end transaction completed (Agent lists → Roseair prices/approves → Buyer buys and pays → chat coordination occurs → shipment tracked → delivered) with **zero direct Buyer-Agent payment leakage** (the single non-negotiable invariant, `roadmap.md §Cross-Phase Principle`).
- Every Product shown to a Buyer has been through the full approval+pricing workflow — no bypass path exists, even for internal testing convenience, in the production environment.
- Admin can operate 100% of required actions (approvals, reconciliation, tracking, complaints) through the Admin Console without direct database access.

## 6. Related Documents

- `mvp-spec.md` — functional/screen-level specification.
- `roadmap.md` — business phase context.
- `development-roadmap.md` — engineering milestone sequencing.

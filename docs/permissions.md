# Roseair Marketplace — Permissions & Authorization Model

## 1. Roles

| Role | Description |
|---|---|
| `Buyer` | Registered purchasing business/individual. |
| `Agent` | Verified sourcing partner (must be `Approved` to act). |
| `Admin` | Roseair operations staff. |
| `SuperAdmin` | Admin with system-configuration and user-management authority. |

Roles are mutually exclusive per user in MVP (`business-rules.md BR-ACT-01`).

## 2. Authorization Model

- **Authentication**: JWT bearer tokens (`architecture.md §Authentication`), issued at login, containing `sub` (UserId), `role`, and minimal claims; refresh-token rotation for session continuance.
- **Authorization**: Role-based access control (RBAC) at the endpoint/policy level, augmented with **resource-ownership checks** (e.g., an Agent may only mutate `Product`s where `Product.AgentId == currentUser.AgentProfileId`). Implemented as ASP.NET Core authorization policies + handler-level ownership checks in the Application layer (not just `[Authorize(Roles=...)]` attributes), since ownership cannot be expressed by role alone.

## 3. Permission Matrix

Legend: ✓ = allowed, ✗ = not allowed, **Own** = allowed only on resources the user owns/is party to.

| Capability | Buyer | Agent | Admin | SuperAdmin |
|---|---|---|---|---|
| Browse/search marketplace | ✓ | ✓ | ✓ | ✓ |
| View product details (public price only) | ✓ | ✓ | ✓ | ✓ |
| View product cost breakdown | ✗ | Own | ✓ | ✓ |
| Add to cart / checkout | ✓ | ✗ | ✗ | ✗ |
| Create/edit own Product | ✗ | Own (if `Approved` agent) | — | — |
| Submit Product for review | ✗ | Own | — | — |
| Approve/reject Product | ✗ | ✗ | ✓ | ✓ |
| Approve/reject Price | ✗ | ✗ | ✓ | ✓ |
| Approve/reject/suspend Agent | ✗ | ✗ | ✓ | ✓ |
| Manage Exchange Rates / pricing config | ✗ | ✗ | ✓ | ✓ |
| View own Orders | Own | — | — | — |
| View Orders as fulfilling Agent | ✗ | Own (as fulfilling agent) | ✓ (all) | ✓ (all) |
| View all Orders (platform-wide) | ✗ | ✗ | ✓ | ✓ |
| Update Shipment / tracking data | ✗ | Own (their shipments) | ✓ (all) | ✓ (all) |
| Confirm payment (Bank Transfer manual review) | ✗ | ✗ | ✓ | ✓ |
| View/send Chat messages | Own thread | Own thread | ✓ (all, read) | ✓ (all, read) |
| Raise Complaint | Own order | Own order (as fulfilling agent) | ✓ | ✓ |
| Resolve Complaint | ✗ | ✗ | ✓ | ✓ |
| View platform Analytics/Reporting | ✗ | ✗ | ✓ (scoped as needed) | ✓ |
| Manage Admin users | ✗ | ✗ | ✗ | ✓ |
| System configuration (thresholds, categories, pricing profiles) | ✗ | ✗ | ✓ (categories/products), ✗ (system thresholds) | ✓ |

## 4. Notes on Ambiguous/Sensitive Cases

- **Agent viewing own product cost data**: allowed because the Agent is the source of `SupplierCost`; Roseair-added components (Freight, CBM, Operational, Commission) visibility to Agent is an open question — default assumption: **Agent sees only their own SupplierCost and the final MarketplacePrice, not Roseair's internal cost/commission components** (protects Roseair's margin from the Agent, consistent with `pricing-engine.md §8`, extended by role).
- **Admin scoping**: MVP assumes a flat Admin role with full operational access; a finer-grained Admin permission model (e.g., "Ops Admin" vs. "Finance Admin" vs. "Support Admin") is a Phase 3 candidate once team size justifies it (see `roadmap.md`).
- **Chat write access**: strictly Buyer/Agent participants only; Admin is read-only unless a future moderation-intervention feature is built (`business-rules.md BR-CHT-03`, `roadmap.md` Phase 3).

## 5. Enforcement Points

Authorization must be enforced at the **Application layer** (use case/handler level), not merely the UI. The API is the trust boundary; the frontend is advisory only. See `architecture.md §Dependency Rules` and `api-design.md §Authorization`.

## 6. Audit

Every approval/rejection/status-transition action performed by `Admin`/`SuperAdmin` is logged with actor, timestamp, and reason where applicable (`database-design.md §Audit Strategy`), supporting both compliance and the "Roseair supervises everything" trust narrative.

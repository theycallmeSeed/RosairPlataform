# Linkano Marketplace — API Design

## 1. Style

REST over HTTPS, JSON payloads, resource-oriented URLs, documented via **Swagger/OpenAPI** (auto-generated from controllers/DTOs, published at `/swagger`). Grouped by module in the OpenAPI spec (matching `architecture.md` folder structure).

## 2. Base URL & Versioning

- Base path: `/api/v{version}/...` (URL-segment versioning — explicit and cache-friendly, avoids header-versioning ambiguity for a public-facing marketplace API that may later have third-party/webhook consumers).
- Start at `v1`. Breaking changes require a new version segment; additive changes (new optional fields, new endpoints) do not bump the version.
- Deprecation policy (from Phase 2 onward, once a v2 exists): deprecated versions supported for a minimum of 6 months, flagged via `Deprecation`/`Sunset` HTTP headers.

## 3. Authentication

- **JWT Bearer tokens**. `POST /api/v1/auth/login` (email/phone + password) → `{ accessToken, refreshToken, expiresAt }`.
- `POST /api/v1/auth/refresh` — rotates refresh token.
- `POST /api/v1/auth/register/buyer`, `POST /api/v1/auth/register/agent` — role-specific registration; Agent registration creates an `AgentProfile` in `PendingReview` (cannot log in to seller functions until `Approved`, though the account itself can authenticate to check status).
- Access token contains `sub` (UserId), `role`, `exp`; short-lived (e.g., 15 min), refresh token longer-lived and rotated on use, stored server-side (revocable) to allow forced logout (e.g., on Agent suspension).

## 4. Authorization

- `[Authorize]` + role policy per endpoint (`RequireRole("Admin","SuperAdmin")`, etc.), plus ownership checks performed in the Application handler (`permissions.md §2`, `architecture.md §9`).
- Every endpoint's required role(s) and ownership constraints are documented in its Swagger operation description (not left implicit).
- `403 Forbidden` for role/ownership failures; `401 Unauthorized` for missing/invalid/expired token.

## 5. Resource Groups (indicative endpoint surface)

### 5.1 Catalog (public + agent + admin)
```
GET    /api/v1/categories
GET    /api/v1/products?category=&search=&page=&pageSize=&sort=       (public, Published only)
GET    /api/v1/products/{id}                                          (public, Published only, buyer-shaped DTO)
POST   /api/v1/agent/products                                         (Agent, Draft creation)
PUT    /api/v1/agent/products/{id}                                    (Agent, own product, triggers re-review if content changed)
POST   /api/v1/agent/products/{id}/submit                             (Agent, Draft/Rejected -> Submitted)
GET    /api/v1/agent/products?status=                                 (Agent, own products, agent-shaped DTO)
GET    /api/v1/admin/products?status=                                 (Admin, review queue, admin-shaped DTO incl. cost)
POST   /api/v1/admin/products/{id}/approve
POST   /api/v1/admin/products/{id}/reject                             (body: reason)
```

### 5.2 Pricing (admin only, plus internal use by Catalog)
```
GET    /api/v1/admin/pricing/exchange-rates
POST   /api/v1/admin/pricing/exchange-rates
GET    /api/v1/admin/products/{id}/prices                             (history)
POST   /api/v1/admin/products/{id}/prices                             (create new ProductPrice, PendingApproval)
POST   /api/v1/admin/prices/{id}/approve
POST   /api/v1/admin/prices/{id}/reject
POST   /api/v1/admin/pricing/recalculate                              (bulk trigger, optional category filter)
```

### 5.3 Agents (admin approval + agent self-service)
```
GET    /api/v1/admin/agents?status=
POST   /api/v1/admin/agents/{id}/approve
POST   /api/v1/admin/agents/{id}/reject                               (body: reason)
POST   /api/v1/admin/agents/{id}/suspend
GET    /api/v1/agent/profile
PUT    /api/v1/agent/profile
POST   /api/v1/agent/profile/documents
```

### 5.4 Cart & Ordering (buyer)
```
GET    /api/v1/buyer/cart
POST   /api/v1/buyer/cart/lines                                        (add product+qty)
PUT    /api/v1/buyer/cart/lines/{id}
DELETE /api/v1/buyer/cart/lines/{id}
POST   /api/v1/buyer/checkout                                          (validates products still Published, creates Order PendingPayment)
GET    /api/v1/buyer/orders?status=
GET    /api/v1/buyer/orders/{id}
GET    /api/v1/agent/orders?status=                                    (order lines/shipments where agent is fulfilling party)
GET    /api/v1/admin/orders?status=&buyerId=&agentId=                  (platform-wide)
POST   /api/v1/admin/orders/{id}/cancel                                (operational override, requires reason)
```

### 5.5 Shipments & Tracking
```
POST   /api/v1/agent/shipments/{id}/ship                               (tracking number, carrier)
POST   /api/v1/admin/shipments/{id}/tracking-events                    (port arrival, customs, delivered)
GET    /api/v1/buyer/orders/{orderId}/tracking
```

### 5.6 Payments & Invoices
```
POST   /api/v1/buyer/orders/{orderId}/payments                         (method, initiates gateway flow)
POST   /api/v1/payments/webhooks/mpesa                                 (gateway callback, signature-verified)
POST   /api/v1/payments/webhooks/emola
POST   /api/v1/buyer/orders/{orderId}/payments/bank-transfer/proof     (upload proof of payment)
POST   /api/v1/admin/payments/{id}/confirm                             (manual bank transfer reconciliation)
GET    /api/v1/buyer/orders/{orderId}/invoice
```

### 5.7 Chat
```
GET    /api/v1/orders/{orderId}/chat                                   (buyer/agent participant, or admin any)
POST   /api/v1/orders/{orderId}/chat/messages
```

### 5.8 Complaints
```
POST   /api/v1/orders/{orderId}/complaints
GET    /api/v1/orders/{orderId}/complaints
GET    /api/v1/admin/complaints?status=&type=
POST   /api/v1/admin/complaints/{id}/resolve
POST   /api/v1/admin/complaints/{id}/reject
POST   /api/v1/complaints/{id}/comments
```

### 5.9 Analytics (admin only)
```
GET    /api/v1/admin/analytics/sales?range=daily|monthly&from=&to=
GET    /api/v1/admin/analytics/sales-by-agent
GET    /api/v1/admin/analytics/top-products
GET    /api/v1/admin/analytics/top-agents
GET    /api/v1/admin/analytics/traffic
GET    /api/v1/admin/analytics/conversion
```

## 6. Response Conventions

- Envelope-free for single-resource responses (return the resource directly) — reduces boilerplate; errors use a distinct, unambiguous shape (see §8) so clients never confuse a payload with an error by envelope alone.
- Collections use a paginated envelope:
```json
{
  "items": [ ... ],
  "page": 1,
  "pageSize": 20,
  "totalItems": 143,
  "totalPages": 8
}
```
- DTO shape varies deliberately by role/endpoint (`ProductDto` for public/buyer vs. `ProductAdminDto` for admin) — never a single "kitchen sink" DTO with fields nulled out based on caller, per `architecture.md §7`. This is the primary enforcement mechanism for `pricing-engine.md §8` visibility rules.
- Money fields always serialized as `{ "amount": 1234.50, "currency": "MZN" }`, never a bare number, to avoid ambiguity as multi-currency is introduced (`business-rules.md BR-FUT-01`).
- Timestamps: ISO-8601 UTC (`2026-07-29T14:30:00Z`).

## 7. Pagination, Filtering, Sorting, Search

- Pagination: `page` (1-based), `pageSize` (default 20, max 100) query params on all collection endpoints.
- Filtering: explicit query params per resource (`status`, `category`, `agentId`, `buyerId`, `dateFrom`, `dateTo`) — no generic OData-style filter query language in MVP (unnecessary complexity for current scale).
- Sorting: `sort=field` / `sort=-field` (leading `-` = descending); default sort documented per endpoint (e.g., products default to `-publishedAt`).
- Search: `search=` free-text param on `/products`, matched against title/description (PostgreSQL `ILIKE`/trigram in MVP — see `database-design.md §8`).

## 8. Error Conventions

Standard error shape (aligned with [RFC 7807 Problem Details](https://www.rfc-editor.org/rfc/rfc7807)):
```json
{
  "type": "https://linkano.example/errors/invalid-order-transition",
  "title": "Invalid Order Transition",
  "status": 409,
  "detail": "Order cannot move from 'Delivered' to 'Shipped'.",
  "instance": "/api/v1/admin/orders/123e4567.../status",
  "traceId": "00-abc123..."
}
```
- `400` — validation failure (FluentValidation errors included as an `errors` extension member, field → messages).
- `401` — unauthenticated. `403` — unauthorized (role/ownership). `404` — resource not found (or not visible to caller — MVP does not distinguish 404 vs. 403 for existence-leak-sensitive resources like other Buyers' Orders, always returning 404 to avoid confirming existence).
- `409` — conflict (illegal state transition, concurrency conflict per `database-design.md §7`).
- `422` — semantically invalid but well-formed request where 400 doesn't fit (rare; prefer 400/409).
- `500` — unhandled server error, generic message only, full detail logged server-side via Serilog, never returned to client.

## 9. Future Webhook Support

Outbound webhooks (Linkano → external systems, e.g., an ERP or a future partner integration) are a Phase 3+ capability (`business-rules.md BR-FUT` context, `architecture.md §15`). Planned shape: subscriber-configured endpoint + shared secret, HMAC-signed payload, event types mirroring the domain events in `domain-model.md §5` (`OrderPlaced`, `OrderStatusChanged`, `PaymentConfirmed`, etc.), with retry/backoff and a delivery log for observability.

## 10. Related Documents

- `permissions.md` — full role/ownership matrix behind Authorization.
- `pricing-engine.md §8` — visibility rules driving DTO shape decisions.
- `architecture.md §7` — DTO/mapping strategy.

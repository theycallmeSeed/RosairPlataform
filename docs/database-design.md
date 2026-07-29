# Roseair Marketplace — Database Design

Target: **PostgreSQL**, accessed via **EF Core**. This document maps `domain-model.md` to tables, defines conventions, and specifies cross-cutting persistence strategies. Column-level DDL is intentionally omitted (implementation detail generated from EF Core configurations) — this document defines *shape, relationships, and rules*, not literal SQL.

## 1. Naming Conventions

- Tables: `snake_case`, plural (`products`, `order_lines`, `product_prices`).
- Columns: `snake_case` (EF Core `UseSnakeCaseNamingConvention` or explicit `IEntityTypeConfiguration` mapping).
- Primary keys: `id` (uuid).
- Foreign keys: `<referenced_table_singular>_id` (e.g., `agent_profile_id`, `order_id`).
- Enums: stored as PostgreSQL `text`/lookup-table-backed values rather than native PG enum types, to keep additive changes (new status values) migration-light; a companion lookup table (e.g., `order_statuses`) is optional and only introduced if the FE/reporting needs referential metadata (labels, sort order) — otherwise a simple checked/text column with an application-level enum is sufficient for MVP.
- Timestamps: `created_at`, `updated_at` (UTC, `timestamptz`), present on every table.

## 2. Entities & Tables (by context)

### 2.1 Identity & Access
- `users` (id, email, phone_number, password_hash, role, full_name, company_name, status, created_at, updated_at)
- `agent_profiles` (id, user_id FK unique, company_legal_name, country_of_operation, approval_status, rejection_reason, approved_at, approved_by_user_id, created_at, updated_at)
- `agent_verification_documents` (id, agent_profile_id FK, document_type, file_url, uploaded_at, reviewed_by_user_id, review_status)
- `buyer_profiles` (id, user_id FK unique, company_name, tax_id, default_shipping_address JSONB, created_at, updated_at)

### 2.2 Catalog
- `categories` (id, name, slug unique, parent_category_id FK nullable, icon_url, sort_order)
- `products` (id, agent_id FK, category_id FK, title, description, specifications JSONB, minimum_order_quantity, status, rejection_reason, current_price_id FK nullable, created_at, updated_at, published_at)
- `product_images` (id, product_id FK, url, sort_order)

### 2.3 Pricing
- `exchange_rates` (id, base_currency, quote_currency, rate numeric(18,6), effective_at, source, created_by_user_id nullable, created_at)
- `product_prices` (id, product_id FK, supplier_cost numeric(18,2), freight numeric(18,2), cbm_allocation numeric(18,2), pre_shipping_costs numeric(18,2), operational_costs numeric(18,2), insurance numeric(18,2) nullable, roseair_commission numeric(18,2), exchange_rate_id FK, marketplace_price numeric(18,2), status, approved_by_user_id nullable, approved_at nullable, rejection_reason nullable, created_at)
- `category_pricing_profiles` (id, category_id FK unique, commission_percent numeric(5,2) nullable, commission_flat numeric(18,2) nullable, operational_cost_percent numeric(5,2) nullable, operational_cost_flat numeric(18,2) nullable)

### 2.4 Ordering
- `carts` (id, buyer_id FK unique, created_at, updated_at)
- `cart_lines` (id, cart_id FK, product_id FK, quantity, unit_price_snapshot numeric(18,2))
- `orders` (id, order_number unique, buyer_id FK, status, is_disputed bool default false, total_amount numeric(18,2), shipping_address JSONB, created_at, payment_confirmed_at nullable, delivered_at nullable)
- `order_lines` (id, order_id FK, product_id FK, agent_id FK, quantity, unit_price_snapshot numeric(18,2), line_total numeric(18,2))
- `shipments` (id, order_id FK, agent_id FK, status, tracking_number nullable, carrier nullable, created_at, updated_at)
- `tracking_events` (id, shipment_id FK, status, location nullable, note nullable, occurred_at)

### 2.5 Payments
- `payment_transactions` (id, order_id FK, method, amount numeric(18,2), currency, status, external_reference nullable, proof_of_payment_url nullable, reconciled_by_user_id nullable, reconciled_at nullable, created_at, confirmed_at nullable)
- `invoices` (id, invoice_number unique, order_id FK, status, issued_at, finalized_at nullable, line_items_snapshot JSONB, total_amount numeric(18,2))

### 2.6 Communication
- `chat_threads` (id, order_id FK nullable-until-created, buyer_id FK, agent_id FK, status, created_at)
- `chat_messages` (id, thread_id FK, sender_user_id FK, body, attachments JSONB, sent_at)
- `chat_message_reads` (id, message_id FK, reader_user_id FK, read_at) — supports multi-reader (Admin supervisory) read tracking without overloading `chat_messages`.

### 2.7 Support
- `complaints` (id, order_id FK, raised_by_user_id FK, type, subject, description, status, resolution_note nullable, resolved_by_user_id nullable, resolved_at nullable, created_at)
- `complaint_comments` (id, complaint_id FK, author_user_id FK, body, attachments JSONB, created_at)

### 2.8 Analytics (materialized/derived — see §7)
- `daily_sales_snapshots`, `agent_performance_snapshots`, `product_performance_snapshots`, `traffic_snapshots` — all derived tables, rebuildable from source-of-truth tables above; not part of the transactional integrity boundary.

## 3. Relationships Summary

See `domain-model.md §3` for the entity-relationship Mermaid diagram (identical structure, this section is its relational restatement):

- `users` 1—0..1 `agent_profiles`, 1—0..1 `buyer_profiles`
- `agent_profiles` 1—* `products`, 1—* `agent_verification_documents`
- `categories` 1—* `products`, 1—0..1 `category_pricing_profiles`, self-referencing (`parent_category_id`)
- `products` 1—* `product_prices` (versioned), 1—* `product_images`
- `exchange_rates` 1—* `product_prices`
- `buyer_profiles` 1—0..1 `carts`, 1—* `orders`
- `orders` 1—* `order_lines`, 1—* `shipments`, 1—* `payment_transactions`, 1—1 `invoices`, 1—0..1 `chat_threads`, 1—* `complaints`
- `shipments` 1—* `tracking_events`
- `chat_threads` 1—* `chat_messages`
- `complaints` 1—* `complaint_comments`

## 4. Aggregates (persistence boundary)

Each aggregate root above maps to a transactional consistency boundary — a single `SaveChangesAsync` call should not need to span more than one aggregate except via eventual consistency (domain events), consistent with `architecture.md §5 Repository Strategy`. E.g., updating an `Order`'s status and creating a `ChatThread` are two separate transactions coordinated by a domain event handler, not one combined `SaveChanges`.

## 5. Soft Delete Strategy

- Entities with user-facing history/audit value (`products`, `orders`, `agent_profiles`, `complaints`, `chat_messages`) use **soft delete**: a nullable `deleted_at` column + global EF Core query filter (`HasQueryFilter(e => e.DeletedAt == null)`), never a hard `DELETE`.
- Purely operational/ephemeral data (`carts`, `cart_lines`) may be hard-deleted (e.g., abandoned cart cleanup job) since it carries no audit obligation.
- Rationale: financial/dispute-relevant records must remain queryable for audit, complaint resolution, and reporting even after a "delete" action (e.g., an Agent removing a product doesn't erase historical Orders referencing it).

## 6. Audit Strategy

- **Row-level audit columns**: `created_at`, `updated_at` (and `created_by_user_id`/`updated_by_user_id` where the actor matters — approvals, status transitions, reconciliations) on every table, per §1.
- **Append-only history tables** for specific high-value audit needs: `product_prices` (never mutated, `Superseded` status instead — `pricing-engine.md §7`), `tracking_events` (append-only log), `complaint_comments` (append-only).
- **Generic audit log** (Phase 2 candidate): a cross-cutting `audit_logs` table (entity type, entity id, action, actor, before/after JSON diff, timestamp) populated via an EF Core `SaveChanges` interceptor, for admin actions not otherwise covered by a dedicated history table (e.g., Agent suspension, Category edits).

## 7. Concurrency Strategy

- **Optimistic concurrency** via a `xmin`-based EF Core concurrency token (PostgreSQL system column) or an explicit `row_version`/`xmin` mapping on aggregates with meaningful concurrent-edit risk: `products` (Agent editing while Admin reviewing), `orders`/`shipments` (status transitions), `product_prices` (concurrent recalculation triggers).
- Conflict resolution: on `DbUpdateConcurrencyException`, the Application layer surfaces a 409 Conflict (`api-design.md §Error Conventions`) rather than silently overwriting — critical for the approval workflows where "Admin approved the version the Agent already changed" must not be silently lost.
- Cart operations are last-writer-wins (low stakes, single-owner resource) — no concurrency token needed.

## 8. Indexing (initial / future)

Baseline indexes beyond PK/FK (created at MVP):
- `products (agent_id, status)` — Agent dashboard "my products by status."
- `products (category_id, status)` — Marketplace browse/filter.
- `orders (buyer_id, status)` — Buyer order history.
- `order_lines (agent_id)` — Agent order fulfillment view.
- `shipments (agent_id, status)` — Agent shipment queue.
- `chat_messages (thread_id, sent_at)` — Thread pagination.
- `complaints (order_id)`, `complaints (status)` — Support queue.

Future (as scale demands, Phase 2+):
- Full-text search index (PostgreSQL `tsvector` / `pg_trgm`) on `products (title, description)` for marketplace search relevance — MVP may start with a simpler `ILIKE`/trigram index before justifying a dedicated search engine (Elasticsearch/Meilisearch) at Phase 3.
- Partial indexes on `products (status) WHERE status = 'Published'` to keep the hot marketplace-browse query fast as catalog grows.
- Composite index on `daily_sales_snapshots (snapshot_date, agent_id)` for reporting once Analytics volume grows.

## 9. Approval, Pricing, Tracking, Complaint Entities — Cross-Reference

Explicitly called out per documentation requirements:
- **Approval entities**: `agent_profiles.approval_status` (+ `agent_verification_documents`), `products.status` (approval sub-flow), `product_prices.status`.
- **Pricing entities**: `exchange_rates`, `product_prices`, `category_pricing_profiles`.
- **Tracking entities**: `shipments`, `tracking_events`.
- **Complaint entities**: `complaints`, `complaint_comments`.

## 10. Related Documents

- `domain-model.md` — the DDD model this schema implements.
- `pricing-engine.md` — business logic behind the pricing tables.
- `architecture.md §5` — repository/persistence access patterns.

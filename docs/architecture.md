# Roseair Marketplace — Architecture

## 1. Overview

Backend: **ASP.NET Core 9**, C#, **Clean Architecture**, deployed initially as a modular monolith (see `system-design.md`). Database: **PostgreSQL** via **Entity Framework Core**. Auth: **JWT**. API: **REST**, documented with **Swagger/OpenAPI**. Validation: **FluentValidation**. Logging: **Serilog**. Future: Docker, Redis, SignalR, background workers, Azure/AWS.

## 2. Folder Structure (Clean Architecture)

```
src/
  Roseair.Domain/
    Common/                      # base entity, value objects, domain event base
    Identity/                    # User, AgentProfile, BuyerProfile
    Catalog/                     # Product, Category
    Pricing/                     # ExchangeRate, ProductPrice
    Ordering/                    # Cart, Order, OrderLine, Shipment, TrackingEvent
    Payments/                    # PaymentTransaction, Invoice
    Communication/                # ChatThread, ChatMessage
    Support/                     # Complaint, ComplaintComment
    Analytics/                   # snapshot/read-model marker types (if any live here)

  Roseair.Application/
    Common/
      Behaviors/                 # MediatR pipeline behaviors (validation, logging, auth)
      Interfaces/                # IRepository<T>, IUnitOfWork, ICurrentUser, IDateTimeProvider,
                                  # IPaymentGateway, IFileStorage, etc. (ports)
    Identity/
      Commands/  Queries/  Validators/  Dtos/
    Catalog/
      Commands/  Queries/  Validators/  Dtos/
    Pricing/
      Commands/  Queries/  Validators/  Dtos/  Services/  (IPricingCalculator)
    Ordering/
      Commands/  Queries/  Validators/  Dtos/
    Payments/
      Commands/  Queries/  Validators/  Dtos/
    Communication/
      Commands/  Queries/  Validators/  Dtos/
    Support/
      Commands/  Queries/  Validators/  Dtos/
    Analytics/
      Queries/  Dtos/

  Roseair.Infrastructure/
    Persistence/
      RoseairDbContext.cs
      Configurations/            # IEntityTypeConfiguration<T> per entity
      Repositories/
      Migrations/
    Identity/                    # JWT token generation, password hashing
    Payments/                    # MPesaGatewayClient, EMolaGatewayClient, BankReconciliationService
    Pricing/                     # ExchangeRateProvider (manual/API)
    Storage/                     # Blob/File storage implementation
    BackgroundJobs/              # Pricing recalculation sweep, notification dispatch
    Logging/                     # Serilog configuration

  Roseair.Api/
    Controllers/  (or Minimal API endpoint modules, grouped by module)
    Middleware/                  # Exception handling, request logging
    Filters/
    Swagger/
    Program.cs
    appsettings.json / appsettings.{Environment}.json

  Roseair.Api.Contracts/          # (optional) shared request/response DTOs if versioning demands
    a separately published contracts project

tests/
  Roseair.Domain.Tests/
  Roseair.Application.Tests/
  Roseair.Infrastructure.Tests/
  Roseair.Api.Tests/               # integration tests (WebApplicationFactory)
```

Each `Domain` subfolder above corresponds 1:1 to a bounded context in `domain-model.md §1`; `Application` mirrors it. This keeps the modular-monolith boundary visually obvious and mechanically enforceable later (folder → project split is a low-effort refactor if/when a module is extracted per `system-design.md §5`).

## 3. Dependency Rules

Standard Clean Architecture inward-pointing dependency rule:

```
Api  →  Application  →  Domain
Infrastructure  →  Application  →  Domain
```

- `Domain` has zero dependencies on other layers or external packages (POCOs only; no EF Core attributes in Domain — mapping lives in `Infrastructure/Persistence/Configurations`).
- `Application` depends only on `Domain` and defines interfaces (ports) that `Infrastructure` implements (Dependency Inversion) — e.g., `IPaymentGateway` is defined in `Application.Payments`, implemented by `Infrastructure.Payments.MPesaGatewayClient`.
- `Api` depends only on `Application` (never directly on `Infrastructure` or `Domain` types in controller signatures — DTOs only).
- Cross-module dependency within `Application` (e.g., Ordering calling Pricing) goes through the other module's public command/query contracts, not its internals (`system-design.md §4`).

Enforcement: project references restrict what's physically possible to reference; architecture tests (e.g., NetArchTest) are recommended from Phase 2 onward to keep this honest as the team grows.

## 4. CQRS Readiness

MVP uses **MediatR-style Commands and Queries** within a single `Application` layer and a single `RoseairDbContext` (not full CQRS with separate write/read stores) — this gives the *shape* of CQRS (clear command/query separation, thin handlers, pipeline behaviors for validation/logging/auth) without the operational cost of a separate read database.

- **Commands**: mutate state, return minimal data (e.g., created id), always validated via FluentValidation pipeline behavior before reaching the handler.
- **Queries**: read-only, may use projection/`AsNoTracking` freely, can bypass repository abstractions and query `DbContext` directly for performance where justified (pragmatic CQRS, not dogmatic).
- **Analytics module** is the first candidate for genuine read-model separation (materialized snapshot tables updated by domain-event handlers, per `system-design.md §3`) since dashboard queries must not compete with transactional load.

Full read/write store separation (event sourcing, separate reporting DB) is a Phase 4 candidate, not required for MVP scale.

## 5. Repository Strategy

- Generic `IRepository<T>` for straightforward aggregate persistence (`Add`, `GetById`, `Update` implicit via change tracking, `Remove`).
- Aggregate-specific repositories (`IOrderRepository`, `IProductRepository`) where query needs exceed generic CRUD (e.g., `GetOrdersByBuyerId`, `GetPublishedProductsByCategory`) — avoid a bloated generic interface; add methods only when a real use case needs them (YAGNI).
- `IUnitOfWork` wraps `SaveChangesAsync`, invoked once per command handler (one transaction per use case).
- Repositories return `Domain` aggregates, never EF entities leaking `Infrastructure` concerns (e.g., no `DbSet` exposed above `Infrastructure`).

## 6. Service Strategy

- **Application Services** = MediatR command/query handlers; one handler per use case (single responsibility, easy to test in isolation).
- **Domain Services** used sparingly, only for logic that doesn't naturally belong to a single aggregate (e.g., `IPricingCalculator` spans `Product`, `ExchangeRate`, and configuration — lives in `Application.Pricing.Services` backed by a `Domain`-level pure calculation function where possible).
- **Infrastructure Services** implement Application-defined ports (`IPaymentGateway`, `IFileStorage`, `INotificationSender`).

## 7. DTO Strategy

- Request/response DTOs are defined per use case in `Application/<Module>/Dtos`, not shared broadly, to avoid coupling unrelated endpoints to one "God DTO."
- DTOs never expose Domain entities directly (`api-design.md §Response Conventions`) — this is also the enforcement point for pricing visibility rules (`pricing-engine.md §8`): a `Buyer`-scoped `ProductDto` simply has no cost-component properties; it is a different shape than the `Admin`-scoped `ProductAdminDto`, not the same DTO with fields hidden at runtime.

## 8. Mapping Strategy

- Explicit mapping methods (`ToDto()` extension methods or small mapper classes) preferred over a general-purpose auto-mapping library for MVP, specifically because pricing-field visibility differs by role/DTO shape and implicit reflection-based mapping makes it easy to accidentally leak a field. If team velocity later justifies it, a mapping library (e.g., Mapperly, source-generator based — not runtime-reflection AutoMapper) can be introduced per-module without a global rewrite.

## 9. Validation Strategy

- **FluentValidation** validators per Command, run automatically via a MediatR pipeline behavior before the handler executes — handlers can assume valid input.
- Two validation tiers:
  1. **Input validation** (shape, required fields, ranges) — FluentValidation.
  2. **Business rule / invariant validation** (state-machine legality, ownership, cross-entity checks) — enforced in the Domain aggregate itself (e.g., `Order.AdvanceStatus(newStatus)` throws a domain exception if the transition is illegal per BR-ORD-01) and/or the Application handler where it needs repository lookups (e.g., "Agent must be Approved to submit a Product").

## 10. Configuration Strategy

- Standard ASP.NET Core configuration (`appsettings.json` + environment-specific overrides + environment variables + user-secrets in dev + a secrets manager — Azure Key Vault / AWS Secrets Manager — in production).
- Strongly-typed `Options` classes (`PricingEngineOptions`, `PaymentGatewayOptions`, `JwtOptions`) bound via `IOptions<T>`, validated at startup (fail-fast on missing/invalid config).

## 11. Logging Strategy

- **Serilog**, structured logging (JSON in production, readable console in dev), sinks: console + file (MVP), extensible to a centralized log platform (Seq/ELK/Azure Monitor) in later phases.
- Correlation ID middleware to trace a request across module boundaries within the monolith (prepares for distributed tracing if/when modules are extracted).
- Sensitive data (passwords, payment gateway secrets, full card/account numbers) explicitly excluded from log templates.

## 12. Exception Strategy

- Domain exceptions (e.g., `InvalidOrderTransitionException`, `AgentNotApprovedException`) thrown from Domain/Application layers, caught by a global exception-handling middleware in `Api`, mapped to the standardized error response shape (`api-design.md §Error Conventions`) and appropriate HTTP status code (400/403/404/409 as applicable) — no raw stack traces returned to clients in production.

## 13. Caching Strategy

- MVP: minimal in-memory caching (`IMemoryCache`) for read-heavy, slow-changing data (Category tree, active ExchangeRate, CategoryPricingProfile).
- Phase 2+: **Redis** distributed cache once horizontal scaling of the API is needed (multi-instance deployment invalidates in-memory-only caching); also candidate for session/rate-limit state.
- Marketplace product listings are cache-invalidated on `ProductPublished`/`ProductPriceChanged` domain events, not time-based polling, to avoid showing stale prices (directly tied to the "prices must reflect FX changes" business requirement).

## 14. Background Jobs Strategy

- MVP: `IHostedService`/`BackgroundService` workers within the same process for: Pricing recalculation sweep (`pricing-engine.md §5`), notification dispatch (order status changes, complaint updates), scheduled Analytics snapshot generation.
- Phase 2+: extract to a dedicated worker process (still same codebase, separate deployable) once job volume/duration risks impacting API responsiveness; introduce a durable job scheduler (Hangfire/Quartz.NET) for retry/visibility rather than raw `BackgroundService` timers.
- Phase 3+: message-queue-driven background processing (Azure Service Bus/RabbitMQ) once modules are extracted into services (`system-design.md §5`).

## 15. Future Integrations

| Integration | Purpose | Phase |
|---|---|---|
| Docker | Containerized deployment, consistent dev/prod parity | Phase 2 |
| Redis | Distributed cache, session/rate-limit store | Phase 2–3 |
| SignalR | Real-time Chat (`Communication` module) and live order/tracking updates | Phase 2–3 |
| Azure/AWS deployment | Managed hosting, secrets, blob storage, CI/CD | Phase 2 |
| Background Workers (dedicated) | Scalable async processing separate from API process | Phase 2–3 |
| Live FX rate API | Automated exchange rate ingestion for Pricing Engine | Phase 3 |
| Payment gateway expansion | Additional methods beyond M-Pesa/e-Mola/Bank Transfer | Phase 3+ |
| Webhooks | Notify external systems (e.g., Roseair ERP) of order/status events | Phase 3+ |

## 16. Related Documents

- `system-design.md` — module boundaries this architecture implements.
- `domain-model.md` — the entities living in `Roseair.Domain`.
- `api-design.md` — what `Roseair.Api` exposes.
- `database-design.md` — what `Infrastructure/Persistence` maps to.

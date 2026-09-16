# Web Test Matrix & Decision Reference

This reference provides exhaustive decision rules, failure surface catalogs, and risk-to-layer mappings for `/web_test_strategy`.

---

## 1. Core Engineering Principles

### Proportionality vs. Test Theatre
Testing must be proportional to actual failure risk.
- Every test introduced incurs ongoing maintenance cost and increases CI latency.
- Tests written purely to increase line coverage without asserting realistic failure modes are **test theatre**.
- A static CSS padding tweak does not warrant a component snapshot or unit test.
- A database write, publication trigger, or role-based check warrants layered, deterministic assertions.

### Ground Truth Rule (Independent Oracles)
- Expected test outcomes must be established **independently** from the implementation code under test.
- Derivation sources: official product specifications, business rules, RFC/protocol standards, fixed test vectors/fixtures, or approved baseline snapshots.
- **Anti-Circular Guard**: Never compute or infer expected outputs by executing the implementation undergoing test.

### Mocking Policy
- **Mock external boundaries only**: Mock third-party APIs (Stripe, Twilio, SendGrid), external cloud storage (S3 buckets), or uncontrollable network latencies.
- **Do not mock internal business logic**: Prefer testing real module interactions, real state transitions, and in-memory databases (e.g., SQLite in-memory or mock storage engines) when cheap and deterministic.
- Avoid "mock theatre": If a test mocks the repository, the service, the validator, and the controller, it only proves that mock objects return mock values.

---

## 2. Risk Classification Framework

| Risk Level | Definition | Impact Scope | Example Triggers | Minimum Mandatory Layers |
| :--- | :--- | :--- | :--- | :--- |
| **LOW** | Cosmetic or isolated static changes with zero state mutation or business logic impact. | Single component or layout node; visual only. | Text copy fixes, static image replacement, localized CSS padding/color adjustments, comment updates. | Static Verification (TypeScript, lint), Visual/Browser Smoke (manual or screenshot if baseline exists). |
| **MEDIUM** | Dynamic UI, client state transitions, routing, or client-side validation logic. | User interaction flows, localized component trees. | Modals, tab switches, client-side filtering, form input validation, dropdown behaviors, responsive navigation menus. | Static Verification, Component Tests, Accessibility Verification, Responsive Verification. |
| **HIGH** | Data mutations, server communications, file handling, access controls, or publication workflows. | Multi-tier persistence, API contracts, cross-session state. | API endpoints (POST/PUT/DELETE), authentication flows, CMS publishing, database writes, file/media uploads, webhook ingestion. | Static Verification, Unit/Component Tests, API Contract Tests, Integration Tests, Security Checks. |
| **CRITICAL** | Destructive, financial, privileged, or irreversible operations. | System integrity, production databases, compliance, security. | Database schema migrations with drops/alters, payment processing, mass deletions, privilege escalation handling, credential rotation. | Static Verification, Unit Tests, Database Invariant Tests, Security Verification, Integration Tests. |

---

## 3. Change-Type to Test-Layer Decision Matrix

### 1. Text / Copy Changes
- **Common Failure Modes**: Text truncation on narrow viewports, broken interpolation tokens (`{{name}}`), unescaped HTML entities, broken translation keys.
- **Default Risk Level**: `LOW`
- **Minimum Test Layers**: Static Verification (type checking templates), Browser Smoke Test (visual check).
- **Optional Escalation Tests**: Responsive Verification if text length increases by >50%.
- **When NOT to Write a Test**: Do not write unit or component tests to assert literal static string content unless the text is dynamically computed or localized.

### 2. CSS & Layout Adjustments
- **Common Failure Modes**: Overflow clipping, z-index collisions, flexbox/grid collapse on mobile, unintended layout shift (CLS).
- **Default Risk Level**: `LOW`
- **Minimum Test Layers**: Static Verification (CSS linter), Responsive Verification (mobile & desktop viewports).
- **Optional Escalation Tests**: Visual Regression test if an approved visual baseline tool exists.
- **When NOT to Write a Test**: Never write Jest/Vitest DOM element style assertion tests (`expect(el).toHaveStyle(...)`) for trivial aesthetic adjustments.

### 3. Image Replacement & Static Assets
- **Common Failure Modes**: Broken asset paths (404), unoptimized file size causing high LCP, missing `alt` attribute, improper aspect ratio distortion.
- **Default Risk Level**: `LOW`
- **Minimum Test Layers**: Static Verification (build asset check), Browser Smoke Test (asset loads with HTTP 200).
- **Optional Escalation Tests**: Accessibility Verification (`alt` attribute present and descriptive).
- **When NOT to Write a Test**: Do not write unit tests to assert asset image URLs.

### 4. Routing & Deep Linking (Client & Server)
- **Common Failure Modes**: 404 on hard browser refresh (SPA fallback missing), route parameter parsing errors, redirect loops, unauthorized route bypass.
- **Default Risk Level**: `MEDIUM`
- **Minimum Test Layers**: Static Verification, Component/Integration Test (route resolution and parameter extraction), Browser Smoke Test (refresh on nested path).
- **Optional Escalation Tests**: Security Verification (protected route guard blocks unauthenticated state).
- **When NOT to Write a Test**: Do not re-test the routing library's internal matching engine; test only your declared routes and navigation guards.

### 5. Component Interaction & Local State
- **Common Failure Modes**: Unhandled toggle state, event listener memory leaks, missing loading state, unhandled null/empty prop rendering.
- **Default Risk Level**: `MEDIUM`
- **Minimum Test Layers**: Static Verification, Component Test (user click/keyboard triggers expected DOM update or event callback).
- **Optional Escalation Tests**: Accessibility Verification (keyboard trigger `Enter`/`Space`, `aria-expanded` toggle).
- **When NOT to Write a Test**: Do not write tests that assert internal component state variables directly; assert observable DOM behavior.

### 6. Forms & Client-Side Validation
- **Common Failure Modes**: Submitting invalid data, validation error message not appearing, double submit on quick double-click, form reset clearing incorrect fields.
- **Default Risk Level**: `MEDIUM`
- **Minimum Test Layers**: Component Test (valid submission, boundary invalid inputs, error message rendering, disabled submit button while pending).
- **Optional Escalation Tests**: Accessibility Verification (`aria-invalid`, `aria-describedby` linking input to error message, focus management).
- **When NOT to Write a Test**: Do not rely solely on client-side form tests for data integrity; server-side validation tests are mandatory if an API is involved.

### 7. Global State Management (Redux, Zustand, Context)
- **Common Failure Modes**: State mutation (breaking reference equality), stale closures in selectors, unnecessary re-renders of unrelated components, reset state failures upon logout.
- **Default Risk Level**: `MEDIUM`
- **Minimum Test Layers**: Unit Test (pure reducer/store actions, state transitions given explicit actions), Component Test (subscriber reflects store update).
- **Optional Escalation Tests**: Performance Verification if large collections or high-frequency updates are involved.
- **When NOT to Write a Test**: Do not test standard boilerplate actions that contain no custom transformation logic.

### 8. API Reads (Data Fetching, Caching, SWR/TanStack Query)
- **Common Failure Modes**: Race conditions (out-of-order response resolving after newer query), unhandled 500/timeout error state, flashing empty state, cache key collisions.
- **Default Risk Level**: `MEDIUM`
- **Minimum Test Layers**: Integration / Component Test with MSW or mock network (assert loading state, success render, error retry state).
- **Optional Escalation Tests**: Unit Test for response data transformation/normalization utilities.
- **When NOT to Write a Test**: Do not test whether the underlying HTTP client (`fetch`/`axios`) works; test how your application handles responses and errors.

### 9. API Mutations (POST, PUT, PATCH, DELETE)
- **Common Failure Modes**: Missing required payload fields, unhandled 400/409/422 errors, duplicate submissions creating duplicate database rows, optimistic update rollback failure.
- **Default Risk Level**: `HIGH`
- **Minimum Test Layers**: API Contract Test (exact request/response schema, status code), Integration Test (mutation updates persistence layer and returns updated resource).
- **Optional Escalation Tests**: Concurrency / idempotency test (repeat identical submission).
- **When NOT to Write a Test**: Never skip API testing under the assumption that frontend client validation is sufficient.

### 10. Authentication (Login, Session, Tokens, Refresh, Logout)
- **Common Failure Modes**: Session fixation, token expiration unhandled, refresh token rotation race condition, logout failing to invalidate server session, sensitive tokens stored in unsecure storage.
- **Default Risk Level**: `HIGH`
- **Minimum Test Layers**: Integration Test (valid login, bad credentials -> 401, expired token -> refresh flow, logout -> invalidated token), Security Verification (cookie flags `HttpOnly`, `Secure`, `SameSite`).
- **Optional Escalation Tests**: E2E Test covering login -> session persistence -> browser restart -> logout.
- **When NOT to Write a Test**: Never write tests that print or assert plain-text secret keys or production credentials.

### 11. Authorization (Role-Based Access Control, Multitenancy)
- **Common Failure Modes**: Horizontal privilege escalation (User A accessing User B's record via ID parameter), vertical privilege escalation (regular user executing admin mutation), hidden UI button with unprotected backend endpoint.
- **Default Risk Level**: `HIGH`
- **Minimum Test Layers**: API Contract / Security Verification (assert 403 Forbidden when unprivileged user calls endpoint), Component Test (admin-only UI hidden for non-admin).
- **Optional Escalation Tests**: Tenant isolation test (assert query filtered strictly by `tenant_id`).
- **When NOT to Write a Test**: Authorization checks must never be skipped or tested only on the frontend.

### 12. CMS CRUD & Publication Workflows
- **Common Failure Modes**: Draft content leaking to public views, slug uniqueness violation, dangling media references upon save failure, timezone shift corrupting publish dates.
- **Default Risk Level**: `HIGH`
- **Minimum Test Layers**: Integration Test (draft creation, editing, publishing, unpublishing), Database Invariant Test (uniqueness constraints, foreign key referential integrity).
- **Optional Escalation Tests**: E2E Test (editor creates draft -> publishes -> verified on public SSR page).
- **When NOT to Write a Test**: Do not write E2E tests for every individual CMS field variation; use fast integration tests for field permutations.

### 13. Database Schema & Migrations
- **Common Failure Modes**: Column drop breaking existing queries, lock contention on large tables, missing default values for non-null columns, broken rollback script.
- **Default Risk Level**: `CRITICAL`
- **Minimum Test Layers**: Database Test (run migration forward -> assert table schema and constraints -> insert sample valid/invalid records -> run rollback -> assert clean state).
- **Optional Escalation Tests**: Data integrity test over a realistic populated mock dataset.
- **When NOT to Write a Test**: NEVER run migration tests against a production database. Always use a dedicated test container or isolated sandbox.

### 14. Image Upload & Image Transformations
- **Common Failure Modes**: Corrupted file crash, server memory exhaustion from massive resolution, wrong MIME type accepted, path traversal via filename, orphaned files on disk after database write failure.
- **Default Risk Level**: `HIGH`
- **Minimum Test Layers**: Unit Test (filename sanitization, MIME validator), Integration Test (valid upload -> storage write -> DB metadata recorded, invalid file -> 400 Bad Request with zero orphaned disk files).
- **Optional Escalation Tests**: Security Verification (SVG containing embedded `<script>` tag blocked or sanitized).
- **When NOT to Write a Test**: Do not test cloud provider infrastructure uptime; test your application's file handler behavior.

### 15. Video & Media Streaming Uploads
- **Common Failure Modes**: Network timeout on large file chunk, incomplete multipart upload without cleanup, unhandled codec transcoding failure, oversized payload rejecting without descriptive error.
- **Default Risk Level**: `HIGH`
- **Minimum Test Layers**: Integration Test (chunked upload protocol, chunk retry, abort/cleanup on cancel), API Contract Test (HTTP 413 on payload too large).
- **Optional Escalation Tests**: Performance Verification (stream piping efficiency without loading entire video into Node.js buffer).
- **When NOT to Write a Test**: Do not transcode multi-gigabyte video files in CI pipelines; use small 500KB test video fixtures.

### 16. Rich Text & User-Generated Content
- **Common Failure Modes**: Stored XSS vulnerability (`<img src=x onerror=alert(1)>`), broken markdown parsing, malformed HTML injection breaking layout, unescaped quote characters.
- **Default Risk Level**: `HIGH`
- **Minimum Test Layers**: Security Verification (HTML sanitizer strips dangerous tags/attributes), Unit Test (parser accurately handles formatting edge-cases and empty text).
- **Optional Escalation Tests**: Component Test (rendered safe HTML in browser).
- **When NOT to Write a Test**: Do not test third-party WYSIWYG editor internal typing behavior; test the sanitization and serialization output.

### 17. Third-Party Integrations & Webhooks
- **Common Failure Modes**: Webhook replay attacks, unverified webhook signatures, unhandled 5xx from external provider, payload schema changes breaking parser.
- **Default Risk Level**: `HIGH`
- **Minimum Test Layers**: Unit Test (signature verification logic with known valid/invalid HMAC keys), Integration Test (mock incoming webhook payload -> expected DB state update -> HTTP 200 return).
- **Optional Escalation Tests**: Timeout and retry backoff test.
- **When NOT to Write a Test**: Never send actual HTTP requests to live third-party production endpoints during automated tests.

### 18. Performance-Sensitive Rendering & Virtualization
- **Common Failure Modes**: Frame drops during scroll, memory leak from unmounted DOM nodes, infinite re-render loop, scroll jump on dynamic height items.
- **Default Risk Level**: `MEDIUM`
- **Minimum Test Layers**: Component Test (virtualizer renders only viewport items + buffer, not full 10,000 items), Performance Verification (render count check).
- **Optional Escalation Tests**: Automated Lighthouse or bundle size threshold check.
- **When NOT to Write a Test**: Do not benchmark trivial lists (<50 static items).

### 19. Responsive Navigation & Mobile Menus
- **Common Failure Modes**: Mobile menu button missing accessible label, scrollbar not locked when drawer open, menu items unreachable on small heights, focus not trapped.
- **Default Risk Level**: `MEDIUM`
- **Minimum Test Layers**: Component Test (open/close trigger), Responsive Verification (assert desktop nav hidden and hamburger visible on 390px viewport), Accessibility Verification (focus trap, Esc key closes).
- **Optional Escalation Tests**: Browser Smoke Test on mobile viewport.
- **When NOT to Write a Test**: Do not write multiple screenshot tests for every single intermediate breakpoint unless responsive design is the primary task.

---

## 4. Web-Specific Failure Surfaces Checklist

When designing the test strategy, systematically evaluate these failure vectors:

1. **Invalid Routes**: Does navigating to an unmapped path render a helpful 404 rather than an uncaught crash?
2. **Stale UI State & Closures**: Do `useEffect` or event handlers capture outdated prop/state values during rapid interactions?
3. **React Remount / StrictMode**: Does the component survive double-invocation in `React.StrictMode` without duplicating data or leaking listeners?
4. **Duplicate Submission**: Does rapid clicking on a submit button trigger multiple mutations, or is it debounced/disabled?
5. **Async Race Conditions**: If Query A is sent, then Query B is sent, but Query A resolves last, does the UI show Query B's results?
6. **State Triad**: Are the Loading, Empty, and Error states explicitly designed and tested alongside the Happy path?
7. **Malformed API Payload**: Does the client handle missing optional fields, unexpected `null`s, or schema version differences gracefully?
8. **Unauthorized Direct URL Access**: Does pasting a protected admin URL directly into a fresh browser tab redirect to login?
9. **Nested Route Browser Refresh**: Does refreshing `https://domain.com/dashboard/settings/billing` work on the production web server?
10. **Upload Boundaries**: What happens on 0-byte file, 100MB file, `.exe` renamed to `.png`, or corrupted header?
11. **Broken Media Fallbacks**: If an image URL returns 404 or fails to load, does the UI display a graceful fallback or skeleton?
12. **Timezone Boundaries**: Do timestamps entered in `America/New_York` display accurately for users in `Asia/Jakarta` or `UTC` without date drift?
13. **Slug Collisions**: What happens when an editor creates a post with an existing title? Is a clean suffix (`-1`) added, or does the DB throw an uncaught 500?
14. **Draft Leakage**: Does an unauthenticated user hitting the public GraphQL/REST API have any query pathway to retrieve draft/unpublished records?
15. **Network Degradation**: Does the UI recover when offline status recovers, and are API timeouts capped?
16. **Mobile Viewport Breakage**: Do modal overlays, fixed action bars, and inputs stay usable when the virtual keyboard appears?

---

## 5. CMS-Specific Invariants

For any CMS, publication engine, or administrative content management task, enforce these 10 invariants:

1. **Publication Boundary**: Draft content must NEVER be visible to public or unauthenticated queries.
2. **Rendering Consistency**: Content published via the CMS must render with visual and structural parity on the public-facing application.
3. **Slug Integrity**: Content slugs must be unique, URL-safe, immutable or redirect-protected upon change, and follow the project's collision policy.
4. **Server-Side Validation Authority**: All constraints (required fields, string lengths, allowed formats) must be validated server-side. Client validation is purely UX enhancement.
5. **No Client-Only Validation**: Disabling JavaScript or tampering with API requests must not allow invalid state persistence.
6. **Admin Mutation Isolation**: Every CMS mutation (create, update, delete, publish, reorder) must enforce authenticated and authorized roles at the endpoint layer.
7. **Referential Atomicity (No Dangling Media)**: A failed database record creation following a media upload must cleanly delete or quarantine the uploaded asset.
8. **Idempotent Edit Operations**: Updating an existing document must update the record in-place; it must never produce unintentional clone records.
9. **Archival & Deletion Rules**: Soft-delete vs. hard-delete policies must be followed consistently, ensuring cascaded relations are either cleaned or safely archived.
10. **Explicit Timezone Governance**: Scheduled publication, modification timestamps, and event dates must store ISO-8601 UTC strings with explicit timezone offsets.

---

## 6. Media Upload Testing Matrix

| Scenario Category | Test Vector | Input / Action | Expected Result | Regression / Integrity Protected |
| :--- | :--- | :--- | :--- | :--- |
| **Normal** | Standard Image | Valid JPEG, 2MB, 1920x1080 | HTTP 200/201; storage URL generated; DB record created; thumbnail rendered. | Standard content publishing workflow. |
| **Boundary** | Max Allowed Size | File at exact threshold (e.g. 10.0MB) | Accepted and processed without timeout. | Size calculation boundary check. |
| **Boundary** | Oversized File | File exceeding threshold (e.g. 10.1MB) | Rejected immediately with HTTP 413; clear user error message; 0 bytes written to storage. | Storage quota and memory protection. |
| **Boundary** | Empty File | 0-byte file | Rejected with HTTP 400 Bad Request. | Corrupted record prevention. |
| **Boundary** | Unsupported MIME | `.exe`, `.svg` with scripts, `.sh` | Rejected with HTTP 415 / 400; MIME sniffed from magic bytes, not file extension. | Arbitrary file upload protection. |
| **Security** | Path Traversal | Filename `../../etc/passwd_avatar.jpg` | Filename sanitized or replaced with random UUID; saved strictly inside upload directory. | Filesystem integrity and directory escape. |
| **Security** | Content Sniffing | Text file renamed to `photo.jpg` | Magic number check fails; upload rejected. | Disguised malicious payload execution. |
| **Failure Integrity** | DB Failure After Upload | Valid file uploaded, but DB transaction throws error | Uploaded file deleted from storage during rollback; no orphaned files or dangling DB IDs. | Transactional storage-to-database integrity. |

---

## 7. Test Layer Decision Catalog

1. **Static Verification**
   - *Tools*: TypeScript (`tsc --noEmit`), ESLint, Prettier.
   - *When Required*: Always. Every single task must pass static checks.
   - *When Skipped*: Never.
2. **Unit Test**
   - *Tools*: Vitest, Jest, Node Test Runner.
   - *When Required*: Pure functions, math formulas, currency calculations, date formatters, data transformation pipelines, validators.
   - *When Skipped*: Trivial wrappers or code with zero decision branching.
3. **Component Test**
   - *Tools*: React Testing Library, Vitest, Vue Test Utils.
   - *When Required*: Interactive UI controls, modals, tabs, forms, conditional render states.
   - *When Skipped*: Presentational static leaf components without logic.
4. **Integration Test**
   - *Tools*: Supertest, Vitest, MSW, in-memory DB fixtures.
   - *When Required*: Multi-layer interactions (Controller -> Service -> DB, API route -> ORM).
   - *When Skipped*: Isolated pure functions that have no I/O.
5. **API Contract Test**
   - *Tools*: Pact, Supertest, Zod schema validation, Vitest.
   - *When Required*: New or modified REST/GraphQL endpoints, webhook payloads.
   - *When Skipped*: Pure frontend visual tweaks with no API interaction.
6. **Database Test**
   - *Tools*: Prisma test environment, Drizzle migration runner, SQLite in-memory, Testcontainers.
   - *When Required*: Schema migrations, unique indexes, transactional operations.
   - *When Skipped*: Tasks without database changes. Never run on production databases.
7. **End-to-End (E2E) Test**
   - *Tools*: Playwright, Cypress.
   - *When Required*: Critical money/user journeys spanning frontend, backend, auth, and database.
   - *When Skipped*: When an integration or component test can prove the requirement faster and without browser flakiness.
8. **Browser Smoke Test**
   - *Tools*: Playwright, Puppeteer, or manual browser verification.
   - *When Required*: Routing changes, layout refactors, build upgrades.
   - *When Skipped*: Headless backend-only utilities.
9. **Responsive Verification**
   - *Tools*: Playwright viewport emulation, Chrome DevTools.
   - *When Required*: Layout changes, navigation drawers, tables, responsive cards.
   - *When Skipped*: Pure API, backend, or non-visual changes.
10. **Accessibility Verification**
    - *Tools*: axe-core, jest-axe, manual keyboard tab-through.
    - *When Required*: Forms, dialogs, dropdowns, buttons, page landmark restructuring.
    - *When Skipped*: Headless backend services.
11. **Visual Regression**
    - *Tools*: Playwright snapshot comparisons, Percy, Chromatic.
    - *When Required*: Design system token overhauls, high-fidelity landing page redesigns.
    - *When Skipped*: Standard functional feature development where DOM structure matters more than pixel delta.
12. **Security Verification**
    - *Tools*: Custom adversarial test vectors, ZAP, static analysis security rules.
    - *When Required*: Auth, session management, file uploads, role checking, user-generated content rendering.
    - *When Skipped*: Static cosmetic content changes.
13. **Performance Verification**
    - *Tools*: Lighthouse CI, bundle-analyzer, performance.now() micro-benchmarks.
    - *When Required*: Heavy data tables, infinite scroll, image optimization changes, bundle changes.
    - *When Skipped*: Low-volume, standard interaction components.

---

## 8. Test Infrastructure Gap & Dependency Recommendation Standard

Before finalizing the strategy:
1. Check `package.json` for installed frameworks (`vitest`, `jest`, `playwright`, `@testing-library/react`).
2. If a required layer has no test runner or assertions library:
   - Report: `Test Infrastructure Gap: [Identified Gap]`
   - Formulate recommendation following this strict format:
     - **Package Name**: e.g., `vitest` or `@playwright/test`
     - **Exact Purpose**: Specific testing layer this unlocks
     - **Why Existing Tooling Is Insufficient**: Why current scripts cannot satisfy the verification oracle
     - **Development-Only**: Confirm it installs under `devDependencies`
     - **Zero-Dependency Alternative**: Explain how to verify with Node.js built-in `node:test` or manual smoke verification if dependencies cannot be added.
3. **Constraint**: Never install packages automatically. Let the user or developer decide.

---

## 9. QA Handoff Contract Specification

The strategy output block ends with the **QA Handoff** directive. This directive is a machine-readable contract directly consumed by `/autonomous_qa_engineer`.

The handoff must specify:
1. **Target Test Path**: Exact path where tests should be authored (e.g., `src/__tests__/auth.test.ts`).
2. **Exact Harness**: Test runner to invoke (e.g., `npx vitest run src/__tests__/auth.test.ts`).
3. **Execution Mode**: Sandboxed runtime, in-memory DB, or mock server.
4. **Assertion Criteria**: Exact HTTP codes, status flags, and schema fields to assert.
5. **Blast Radius Checklist**: Existing test files or commands that must remain green with zero regressions.

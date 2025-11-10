## GitHub Copilot Project Instructions

These guidelines teach AI assistants (Copilot Chat, inline completions, etc.) how to contribute code and content to this Nuxt + Contentful project safely and consistently.

### 1. Project Snapshot
- Framework: Nuxt 4 (Vue 3, `<script setup>` preferred)
- Language: TypeScript (strict; avoid implicit `any`)
- Data layer: GraphQL (Contentful), generated SDK in `app/generated/`
- Styling: Tailwind CSS + Nuxt UI (components) — keep utility classes concise; extract repeated patterns into small components.
- Runtime config: Use `useRuntimeConfig()`; never hardcode tokens.

### 2. Goals & Priorities
1. Correctness & type-safety
2. Readability > cleverness
3. Minimal external deps
4. Fail fast with clear errors; avoid silent fallback unless explicitly required
5. Keep bundle lean

### 3. File & Folder Conventions
- App code under `app/`
- GraphQL codegen outputs: `app/generated/`
- Mappers/utilities: `app/utils/`
- Queries: `app/queries/` (one file per logical query)
- Avoid deep nesting; prefer flat, purpose-driven folders.

### 4. Coding Style (Vue + TS + UI)
- Use `<script setup lang="ts">` for new Vue SFCs.
- Prefer named composables for reusable logic (`useXyz`).
- Avoid optional chaining after validated non-null values.
- Narrow types with explicit guards, e.g. `if (!item) return` or custom predicate functions.
- Prefer `const` and pure functions; side effects belong in plugins/composables.
- Nuxt UI components first (e.g. `<UButton />`, `<UCard />`) before rolling custom markup.
- Tailwind utilities: favor readability (group logically). Extract repeated utility patterns into small components when it improves clarity.
- Do not inline arbitrary color hex values; prefer design tokens / default palette.
- Responsive: apply mobile-first utilities; only add breakpoints actually needed.

### 5. GraphQL & Data Mapping
- Never embed raw queries inside components; place them in `app/queries/`.
- Use generated types from `~/generated/nuxt-tutorial` for all responses.
- When mapping arrays of `Maybe<T>`, use explicit type guard:
  ```ts
  function isProfile(p: typeof profiles[number]): p is Profile { return !!p }
  const valid = profiles.filter(isProfile)
  ```
- Avoid swallowing data issues with `?? []` unless truly optional.
- Log anomalies with `console.warn('Profile missing id', raw)` (do not log secrets).

### 6. Error Handling
- Distinguish between programmer errors and data absence.
- Throw for invariant violations (`throw new Error('Expected space id')`).
- Return empty arrays only when absence is legitimate.
- Wrap network calls with minimal try/catch if adding custom fetch logic; propagate meaningful message.

### 7. Runtime Config & Secrets
- Access tokens only via `useRuntimeConfig()`.
- Never print tokens or space IDs in client-rendered logs.
- If adding env vars, document them in `README.md` and add placeholder names.

### 8. Performance
- Batch GraphQL requests where practical.
- Avoid N+1 mapping loops triggering extra network fetches in components.
- Memoize expensive derived data inside composables using `computed`.

### 9. Testing (Future Expansion)
- If adding tests, prefer lightweight Vitest (add only when first test is introduced).
- Test mappers: happy path, null items trimming, edge cases (empty collections).

### 10. Commits & PR Guidance
- One logical change per commit; clear message: `feat(mapper): normalize profile role`.
- For AI-generated multi-file changes, include summary comment at top of each new file.
- All PRs to `main` must pass CI: lint (`pnpm lint`) and type-check (`pnpm type-check`).

### 11. AI Completion DO / DON'T
DO:
- Use existing import paths (`~/generated/...`, `useRuntimeConfig`).
- Keep functions small (< ~25 LOC).
- Add JSDoc for public utilities.
- Surface type guard helpers when needed.

DON'T:
- Introduce heavy dependencies for trivial tasks.
- Mutate objects from generated SDK directly.
- Recompute unchanged expensive data each render.
- Use `any` or disable TypeScript rules.

### 12. Mapper Pattern Reference
Example pattern (profiles):
```ts
export function mapUserProfiles(data: GetUserProfilesQuery) {
  const items = data.usersCollection?.items ?? []
  const profiles = items.flatMap(u => u?.profilesCollection?.items ?? [])
  const valid = profiles.filter((p): p is NonNullable<typeof p> => !!p)
  return valid.map(p => ({
    id: p.sys.id,
    firstName: p.firstName ?? 'Unnamed',
    lastName: p.lastName ?? 'User',
    email: p.email ?? '',
    role: p.role ?? '',
    summary: p.summary?.json ?? null,
  }))
}
```

### 13. Accessibility & UX (UI + Tailwind + Nuxt UI)
- Use semantic elements when creating components.
- Provide alt text for images from CMS; fallback: `'Content image'`.
- Prefer Nuxt UI accessible components over raw elements (they often include ARIA attributes already).
- Maintain color contrast (Tailwind palette defaults are usually safe; verify custom combinations).
- Use focus-visible styles (Nuxt UI provides defaults; do not remove them).

### 13.1 Tailwind & Nuxt UI Usage Rules
- Prefer composition: Wrap Nuxt UI primitives with project-specific components if styling repeats 3+ times.
- Keep layout concerns (flex/grid/spacing) at parent level; keep child components mostly about content and minimal styling.
- If introducing custom plugin/theme tweaks, document them here.

### 14. Extensibility Principles
- Prefer composables over global singletons.
- Add adapters (e.g., `contentfulUserAdapter`) if mapping grows complex.
- Isolate third-party specifics in one layer; expose normalized domain models.

### 15. When Unsure
1. Favor smallest, typed solution.
2. Leave a TODO with context (date + rationale): `// TODO(2025-11-10): refine query to include avatar URL`.
3. Avoid speculative abstractions.

### 16. Requesting Credentials (AI Guidance)
- If an operation requires missing env vars, instruct user to set them—do not invent values.

### 17. Adding New Queries
1. Define `.graphql` or tagged template in `app/queries/`.
2. Run `pnpm codegen`.
3. Import generated types only; avoid manual interfaces duplicating them.

### 18. Logging Standards
- Use `console.warn` for recoverable data discrepancies.
- Avoid `console.log` spam in production code paths.
- No logging of full objects containing secrets.

### 19. Security Considerations
- Never expose tokens or space IDs client-side.
- Sanitize or trust Contentful structured rich text renderer; do not manually inject HTML without escaping.

### 20. Style of AI Responses (Chat)
- Concise, actionable.
- Provide diff summary without restating entire unchanged files.
- Offer optional improvements clearly marked as such.

## Core Development Philosophy (E‑commerce)
You are an experienced Vue/Nuxt developer building a sophisticated e‑commerce platform. Follow these principles:

- Domain-first thinking: model products, variants, pricing, availability, and content as separate concerns. Keep Contentful as the content source; keep commerce logic independent and adaptable to any backend.
- Predictable data shapes: normalize responses at the edges (mappers in `app/utils/`), expose stable domain types, and keep components dumb.
- Performance as a feature:
  - Prefer SSG/ISR or cached SSR for content-heavy pages; hydrate only what’s interactive.
  - Lazy-load non-critical components; split large routes when it helps.
  - Avoid client-side N+1: request collections with required fields in single GraphQL queries.
- Accessibility by default: keyboard navigation, focus management, and sufficient contrast. Prefer Nuxt UI primitives for controls and dialogs.
- Error UX: distinguish empty vs error vs loading. Provide safe fallbacks and retry affordances where meaningful.
- Observability: minimal console noise; warn only for data anomalies. Centralize error capture in composables or plugins when appropriate.
- Security: never expose secrets client-side; validate inputs; avoid trusting client-provided identifiers for sensitive operations.
- Internationalization-ready: avoid hard-coded strings; centralize copy to accommodate future i18n.
- Extensibility: prefer composables and adapters over deep prop-drilling; isolate third-party specifics; keep domain pure.
- Testing where it pays: unit-test mappers and critical pricing/availability logic first; use snapshot tests sparingly for complex UI states.

If you discover improvements during implementation (structure, performance, clarity), prefer the smallest change that improves developer and user experience. Add TODOs with date + rationale when deferring.

---
### Customization Checklist (Edit Me Later)
- [ ] Define styling approach (Tailwind? CSS modules?)
- [ ] Add testing framework decision
- [ ] Specify lint rules overrides if any
- [ ] Document domain model (UserProfile shape) centrally

---
Feel free to extend these sections; keep instructions current when project conventions evolve.

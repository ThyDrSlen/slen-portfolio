# Slen.win Portfolio Launch Plan

## TL;DR
> **Summary**: Build a static-first Next.js App Router portfolio at `https://slen.win` that sells Fabrizio Corrales to recruiters and peers through a light, tech-lab-minimal visual system, three deep case studies, and strong proof-driven storytelling.
> **Deliverables**:
> - Recruiter-friendly home page with distinctive but scannable design
> - Work index plus case studies for Form Factor, orwell-scraper, and an anonymized Palo Alto story
> - About page with concise journey, resume download, GitHub/LinkedIn links, and direct email CTA
> - TDD harness, accessibility/performance/SEO checks, and Vercel custom-domain launch path for `slen.win`
> **Effort**: Large
> **Parallel**: YES - 5 waves
> **Critical Path**: T1 -> T3 -> T4 -> T5/T9 -> T10/T11/T12 -> T13 -> T14

## Context
### Original Request
- Plan a portfolio website that highlights work from a "technogloist career"
- Use Next.js
- Host it on owned domain `slen.win`
- Pull proof from GitHub `https://github.com/ThyDrSlen`, LinkedIn `https://www.linkedin.com/in/fabrizio-corrales/`, and resume in Downloads
- Make it unique, not basic, not cookie-cutter

### Interview Summary
- Audience priority is recruiters + peers, not freelance lead generation or content marketing
- Visual direction is tech-lab minimal, not cinematic/editorial or brutalist
- V1 scope is a multi-page portfolio with 2-3 deep case studies
- Featured case studies are `form-factor`, `orwell-scraper`, and an anonymized Palo Alto Networks story
- Testing strategy is TDD from the start
- The repo is fully greenfield: no app, no git repo, no test setup, no deploy config

### Metis Review (gaps addressed)
- Default contact path to direct `mailto:` plus GitHub/LinkedIn; no backend form in V1
- Default content source-of-truth to in-repo typed content modules; no CMS and no blog in V1
- Default canonical domain to apex `https://slen.win`; redirect `www` to apex
- Default analytics to none in V1 to avoid consent/scope creep
- Require a public-safe disclosure matrix for every case study, especially Palo Alto
- Treat content readiness as a first-class delivery track equal to styling and engineering

## Work Objectives
### Core Objective
Launch a memorable, recruiter-friendly personal site that proves Fabrizio can ship polished product work, think systemically, and communicate technical decisions clearly without exposing confidential details.

### Deliverables
- `src/app` Next.js App Router site using TypeScript, `pnpm`, and static-first rendering
- Light-theme tech-lab design system with custom typography, grid texture, restrained motion, and reduced-motion support
- Public routes: `/`, `/work`, `/work/form-factor`, `/work/orwell-scraper`, `/work/palo-alto`, `/about`
- Public assets and downloads: `/resume.pdf`, OG image assets, favicon, and case-study media/diagram assets that are safe to publish
- Test + quality stack: Vitest, React Testing Library, Playwright, axe, Lighthouse CI, ESLint, TypeScript, GitHub Actions
- Deploy path: GitHub repo, Vercel project, apex `slen.win` canonical, `www` redirect, and DNS checklist

### Definition of Done (verifiable conditions with commands)
- `pnpm lint` exits `0`
- `pnpm typecheck` exits `0`
- `pnpm test -- --run` exits `0`
- `pnpm test:e2e` exits `0`
- `pnpm lighthouse` exits `0`
- `pnpm build` exits `0`
- `pnpm start` serves all public routes without runtime errors
- `curl -I https://slen.win` returns `200` after launch and `curl -I https://www.slen.win` redirects to apex

### Must Have
- Next.js App Router with Server Components by default and client boundaries only where motion/browser APIs are required
- Fixed V1 IA: Home, Work, About, three case studies, resume download, direct contact CTA
- Typed in-repo content model with required fields for every case study and a disclosure/sanitization policy
- Flagship emphasis on Form Factor, secondary technical proof from orwell-scraper, and a public-safe Palo Alto narrative
- Tech-lab minimal visual system that is distinctive through typography, layout, grid treatment, and copy hierarchy rather than gimmicks
- Mobile-first responsive behavior, keyboard navigation, skip link, strong contrast, and reduced-motion compliance
- Metadata, OG cards, sitemap, robots, canonical tags, and structured data for home/about/work/case-study routes
- TDD-first execution with executable coverage for schema validation, route behavior, accessibility, metadata, and deployment readiness

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- No blog, CMS, search, auth, comments, dashboard, or newsletter in V1
- No contact form backend, CAPTCHA, or third-party form service in V1
- No skill bars, template hero copy, tutorial-clone project framing, or generic "passionate developer" language
- No dark-mode toggle, 3D scene, scroll hijacking, autoplay video backgrounds, or animation that harms scannability
- No unapproved company logos, internal screenshots, invented metrics, customer names, or confidential product details
- No broken external links, placeholder content, `TBD` strings, or empty case-study slots at launch

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: TDD with Vitest + React Testing Library for schema/component coverage, Playwright for route/a11y/reduced-motion/e2e checks, Lighthouse CI with thresholds `performance >= 90`, `accessibility >= 95`, `best-practices >= 95`, `seo >= 95` on `/` and one case-study route
- QA policy: Every task includes at least one happy-path and one failure/edge-path scenario with explicit selectors, commands, and evidence locations
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`
- Baseline scripts: `pnpm lint`, `pnpm typecheck`, `pnpm test -- --run`, `pnpm test:e2e`, `pnpm lighthouse`, `pnpm build`
- Stability contract: Implement `data-testid` hooks for nav, hero, cards, case-study sections, resume link, and contact CTA so Playwright never depends on fragile text selectors

## Execution Strategy
### Parallel Execution Waves
> Greenfield bootstrap creates a hard first dependency; after that, fan out aggressively.

Wave 1: T1 bootstrap repo and Next.js scaffold
Wave 2: T2 quality gates
Wave 3: T3 content schema, T5 visual system foundation
Wave 4: T4 content intake plus T6 home, T7 work index, T8 about/contact, T9 shared case-study template
Wave 5: T10 Form Factor, T11 orwell-scraper, T12 Palo Alto anonymized case study, T13 metadata/SEO, then T14 launch readiness

### Dependency Matrix (full, all tasks)
| Task | Depends On | Blocks |
| --- | --- | --- |
| T1 | none | T2, T3, T5, T14 |
| T2 | T1 | T14 |
| T3 | T1, T2 | T4, T9, T13 |
| T4 | T3 | T6, T7, T8, T10, T11, T12 |
| T5 | T1, T2 | T6, T7, T8, T9 |
| T6 | T4, T5 | T13 |
| T7 | T4, T5 | T13 |
| T8 | T4, T5 | T13 |
| T9 | T3, T4, T5 | T10, T11, T12, T13 |
| T10 | T9 | T13 |
| T11 | T9 | T13 |
| T12 | T9 | T13 |
| T13 | T6, T7, T8, T9, T10, T11, T12 | T14 |
| T14 | T2, T13 | F1-F4 |

### Agent Dispatch Summary (wave -> task count -> categories)
| Wave | Task Count | Categories |
| --- | --- | --- |
| Wave 1 | 1 | `quick` |
| Wave 2 | 1 | `unspecified-high` |
| Wave 3 | 2 | `deep`, `visual-engineering` |
| Wave 4 | 5 | `writing`, `visual-engineering`, `deep` |
| Wave 5 | 5 | `writing`, `deep`, `quick` |

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [ ] 1. Initialize repository, branch, and Next.js scaffold

  **What to do**: Initialize git in the current folder, create branch `feat/slen-portfolio`, scaffold a fresh Next.js App Router project in-place with `pnpm`, TypeScript, ESLint, and `src/` layout, and keep the scaffold intentionally minimal: no Tailwind, no example content beyond what is needed to boot and test the app. Add `.nvmrc` pinned to the current LTS major used by the scaffold, preserve `src/app`, and ensure the package name is `slen-portfolio`.
  **Must NOT do**: Do not scaffold Tailwind, Pages Router, blog examples, or work directly on `main`/`master`.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: repo/bootstrap work is deterministic and tightly scoped
  - Skills: [`git-master`] - safe repo initialization and branch hygiene
  - Omitted: [`frontend-ui-ux`] - no design implementation belongs in this task

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: T2, T3, T5, T14 | Blocked By: none

  **References** (executor has NO interview context - be exhaustive):
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - confirms Next.js, greenfield state, and branch intent
  - Official: `https://nextjs.org/docs/app/getting-started/layouts-and-pages` - App Router baseline
  - Official: `https://nextjs.org/docs/app/getting-started/server-and-client-components` - server-first rendering rule for later tasks

  **Acceptance Criteria** (agent-executable only):
  - [ ] `git branch --show-current` returns `feat/slen-portfolio`
  - [ ] `package.json`, `pnpm-lock.yaml`, `src/app/layout.tsx`, `src/app/page.tsx`, and `tsconfig.json` exist
  - [ ] No Tailwind config file exists in the repo root
  - [ ] `pnpm lint` exits `0`
  - [ ] `pnpm build` exits `0`

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Greenfield scaffold is healthy
    Tool: Bash
    Steps: Run `git branch --show-current`; run `test -f package.json`; run `test -f src/app/layout.tsx`; run `pnpm lint`; run `pnpm build`
    Expected: Branch is `feat/slen-portfolio`; required files exist; lint and build both exit `0`
    Evidence: .sisyphus/evidence/task-1-init-scaffold.txt

  Scenario: Unwanted defaults are absent
    Tool: Bash
    Steps: Run `test ! -f tailwind.config.ts`; run `test ! -f tailwind.config.js`; run `test ! -f app/page.tsx`
    Expected: No Tailwind config exists and routing lives under `src/app` rather than root `app/`
    Evidence: .sisyphus/evidence/task-1-init-scaffold-error.txt
  ```

  **Commit**: YES | Message: `chore(init): scaffold next portfolio workspace` | Files: `.gitignore`, `.nvmrc`, `package.json`, `pnpm-lock.yaml`, `src/app/*`, `tsconfig.json`, Next.js config files

- [ ] 2. Establish TDD toolchain and CI gates

  **What to do**: Add Vitest + React Testing Library for unit/schema/component tests, Playwright + `@axe-core/playwright` for e2e/accessibility checks, and Lighthouse CI for performance/SEO budgets. Define scripts `lint`, `typecheck`, `test`, `test:e2e`, `lighthouse`, and `build`; add shared test setup in `src/test`; add a minimal smoke spec for `/` and one unknown route; configure Lighthouse CI against `/` at this stage only; and add `.github/workflows/ci.yml` that runs install, lint, typecheck, unit tests, build, and Playwright on every push/PR. Task 13 will expand Lighthouse targets to include a real case-study route once those pages exist.
  **Must NOT do**: Do not introduce Cypress, Jest, Storybook, Docker-only test runners, or snapshot-heavy tests for styling.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: multiple tools/configs must work together cleanly on a new repo
  - Skills: [] - standard tooling setup is enough
  - Omitted: [`git-master`] - no special git workflow beyond normal commits

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: T3, T5, T14 | Blocked By: T1

  **References** (executor has NO interview context - be exhaustive):
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - confirms TDD from start
  - Public repo: `https://github.com/ThyDrSlen/form-factor` - existing public signal that Playwright-driven QA already fits the user's ecosystem
  - Official: `https://nextjs.org/docs/app/getting-started/server-and-client-components` - keep tests aligned with server-first boundaries

  **Acceptance Criteria** (agent-executable only):
  - [ ] `pnpm typecheck` exits `0`
  - [ ] `pnpm test -- --run` exits `0`
  - [ ] `pnpm test:e2e` exits `0`
  - [ ] `pnpm lighthouse` exits `0`
  - [ ] Lighthouse CI enforces `performance >= 90`, `accessibility >= 95`, `best-practices >= 95`, and `seo >= 95` on `/`
  - [ ] `.github/workflows/ci.yml` runs the same command set without missing scripts

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Baseline quality stack is green
    Tool: Bash
    Steps: Run `pnpm typecheck`; run `pnpm test -- --run`; run `pnpm test:e2e`; run `pnpm lighthouse`; run `pnpm build`
    Expected: Every command exits `0` and produces no missing-script/config errors while Lighthouse targets only `/`
    Evidence: .sisyphus/evidence/task-2-quality-stack.txt

  Scenario: Missing route is handled by e2e smoke coverage
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/smoke.spec.ts --grep "404"`
    Expected: The spec passes only if `/not-a-real-route` returns the planned not-found experience instead of crashing or hanging
    Evidence: .sisyphus/evidence/task-2-quality-stack-error.txt
  ```

  **Commit**: YES | Message: `test(tooling): add vitest playwright axe and lighthouse gates` | Files: `package.json`, `pnpm-lock.yaml`, `vitest.config.*`, `playwright.config.*`, `.github/workflows/ci.yml`, `src/test/*`, `tests/e2e/*`, Lighthouse config

- [ ] 3. Model site content and disclosure schema

  **What to do**: Create typed in-repo content modules under `src/content/` and validation helpers under `src/lib/` so V1 content lives in code, not MDX or a CMS. Define Zod schemas for `siteConfig`, `socialLinks`, `experienceEntries`, and `caseStudies`, with fixed slugs `form-factor`, `orwell-scraper`, and `palo-alto`. Add a disclosure matrix to every case study with required fields `anonymizationLevel`, `allowedClaims`, `forbiddenClaims`, `allowedAssetTypes`, `requiresDisclaimer`, and `proofLinks`; then add helper functions that expose featured studies and slug lookups for route generation.
  **Must NOT do**: Do not introduce MDX, Contentlayer, headless CMS tooling, or untyped JSON blobs.

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: this task defines the content contract that every route and test depends on
  - Skills: [] - core TypeScript/schema design is enough
  - Omitted: [`frontend-ui-ux`] - schema work matters more than visuals here

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: T4, T9, T13 | Blocked By: T1, T2

  **References** (executor has NO interview context - be exhaustive):
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - fixed case-study list, anonymized Palo Alto requirement, and no-blog/CMS scope
  - Official: `https://nextjs.org/docs/app/api-reference/functions/generate-metadata` - later metadata generation depends on predictable content fields
  - Source repo: `https://github.com/ThyDrSlen/form-factor` - public proof source for Form Factor metadata and links
  - Source repo: `https://github.com/ThyDrSlen/orwell-scraper` - public proof source for orwell-scraper metadata and links

  **Acceptance Criteria** (agent-executable only):
  - [ ] `src/content/site.ts`, `src/content/case-studies.ts`, and `src/lib/content-schema.ts` exist
  - [ ] Case-study schema rejects entries missing `slug`, `title`, `summary`, `role`, `outcomes`, `proofLinks`, or disclosure metadata
  - [ ] Palo Alto entry requires `anonymizationLevel: "anonymized"` and `requiresDisclaimer: true`
  - [ ] `pnpm test -- --run src/test/content-schema.test.ts` exits `0`

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Valid structured content passes schema tests
    Tool: Bash
    Steps: Run `pnpm test -- --run src/test/content-schema.test.ts`
    Expected: Tests pass and confirm all three required slugs plus site config are valid
    Evidence: .sisyphus/evidence/task-3-content-schema.txt

  Scenario: Invalid content fixture fails loudly
    Tool: Bash
    Steps: Run `pnpm test -- --run src/test/content-schema-invalid.test.ts`
    Expected: The negative test passes only if an intentionally broken fixture throws a validation error for missing required fields
    Evidence: .sisyphus/evidence/task-3-content-schema-error.txt
  ```

  **Commit**: YES | Message: `feat(content): define typed site content and disclosure schema` | Files: `src/content/*`, `src/lib/content-schema.*`, `src/test/content-schema*.test.*`

- [ ] 4. Ingest resume and public-source content into structured data

  **What to do**: Locate the latest resume file in `/Users/slenthekid/Downloads`, copy the publish-safe PDF to `public/resume.pdf`, and use the resume plus public GitHub/LinkedIn/Marcy sources to fill `src/content/` with real copy. Write concise recruiter-facing hero/about copy, convert the three selected projects into structured case-study content, and add proof links for every public claim. For Palo Alto, keep the story anonymized: describe public-safe domain/context, responsibilities, technical approach, and outcomes without product names, customer names, internal screenshots, or confidential metrics; include an explicit disclaimer string in the entry.
  **Must NOT do**: Do not invent metrics, leave `TBD` placeholders, expose internal codenames, or publish assets that are not clearly public-safe.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: this is structured content synthesis grounded in real source material
  - Skills: [] - source extraction and concise writing are the core needs
  - Omitted: [`frontend-ui-ux`] - no visual implementation should happen yet

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: T6, T7, T8, T10, T11, T12 | Blocked By: T3

  **References** (executor has NO interview context - be exhaustive):
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - confirms selected work, audience, and anonymized Palo Alto treatment
  - Local source dir: `/Users/slenthekid/Downloads` - locate the resume here before deriving resume/contact data
  - Public profile: `https://github.com/ThyDrSlen` - overall repo inventory and current focus
  - Public profile: `https://www.linkedin.com/in/fabrizio-corrales/` - role/company/timeline verification
  - Public profile: `https://www.marcylabschool.org/people/fabrizio-corrales` - non-traditional journey proof
  - Source repo: `https://github.com/ThyDrSlen/form-factor` - flagship proof links and public stack details
  - Source repo: `https://github.com/ThyDrSlen/orwell-scraper` - public automation project proof links

  **Acceptance Criteria** (agent-executable only):
  - [ ] `public/resume.pdf` exists and is linked from structured site content
  - [ ] No `TBD`, `TODO`, or placeholder lorem strings exist under `src/content/`
  - [ ] Every case study has at least one public proof link and one explicit outcome/result statement
  - [ ] Palo Alto content includes a disclaimer and disclosure matrix that forbids screenshots, customer names, internal metrics, and product codenames
  - [ ] `pnpm test -- --run src/test/content-copy.test.ts src/test/palo-alto-sanitization.test.ts` exits `0`

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Real copy is complete and publishable
    Tool: Bash
    Steps: Run `test -f public/resume.pdf`; run `pnpm test -- --run src/test/content-copy.test.ts`; run `pnpm exec rg -n "TBD|TODO|Lorem ipsum" src/content public`
    Expected: Resume file exists; content tests pass; ripgrep returns no placeholder strings
    Evidence: .sisyphus/evidence/task-4-content-intake.txt

  Scenario: Palo Alto sanitization rules catch unsafe copy
    Tool: Bash
    Steps: Run `pnpm test -- --run src/test/palo-alto-sanitization.test.ts`
    Expected: The negative assertions prove forbidden terms/assets are blocked and the disclaimer is required
    Evidence: .sisyphus/evidence/task-4-content-intake-error.txt
  ```

  **Commit**: YES | Message: `feat(content): ingest resume and public-safe case-study copy` | Files: `public/resume.pdf`, `src/content/*`, `src/test/content-copy.test.*`, `src/test/palo-alto-sanitization.test.*`

- [ ] 5. Build the visual system and global shell

  **What to do**: Create the site-wide visual system using CSS variables and custom CSS, not Tailwind. Use a light tech-lab palette with paper-like background, graphite text, faint grid texture, acid-lime accent, and steel/cyan support colors; load `Space Grotesk` for display/body and `IBM Plex Mono` for metadata via `next/font`. Build the app shell in `src/app/layout.tsx` and shared shell components so every page gets the same header, footer, skip link, route container, and reduced-motion-safe page transition wrapper. Establish the stable selector contract here: `site-shell`, `skip-link`, `primary-nav`, `nav-link-work`, `nav-link-about`, `resume-download-link`, `contact-email-link`, and `footer-social-links`.
  **Must NOT do**: Do not add a dark-mode toggle, 3D canvas, scroll hijacking, glassmorphism, or generic template styling.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: this task sets the unique visual language and shared interaction rules
  - Skills: [] - custom CSS and shell composition are the main needs
  - Omitted: [`frontend-ui-ux`] - visual direction is already decided and should be executed directly

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: T6, T7, T8, T9 | Blocked By: T1, T2

  **References** (executor has NO interview context - be exhaustive):
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - confirms tech-lab minimal visual lane and recruiter-first audience
  - Research source: `https://cassie.codes/` - reference for strong atmosphere without sacrificing readability
  - Research source: `https://www.codewonders.dev/` - reference for restrained motion and text-led hierarchy
  - Official: `https://nextjs.org/docs/app/getting-started/layouts-and-pages` - root layout structure

  **Acceptance Criteria** (agent-executable only):
  - [ ] `src/app/layout.tsx` loads the chosen fonts with `next/font`
  - [ ] Global tokens for colors, spacing, type scale, border radius, and motion duration exist in `src/app/globals.css` or equivalent shared CSS
  - [ ] Header/footer/skip-link components expose the required `data-testid` values
  - [ ] Keyboard focus styles are visible and skip link jumps to main content
  - [ ] `pnpm test -- --run src/test/site-shell.test.tsx` exits `0`

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Shell selectors and keyboard affordances are stable
    Tool: Bash
    Steps: Run `pnpm test -- --run src/test/site-shell.test.tsx`; run `pnpm exec playwright test tests/e2e/site-shell.spec.ts --grep "keyboard"`
    Expected: Unit and e2e checks confirm the shell renders required selectors and the skip link/focus flow works
    Evidence: .sisyphus/evidence/task-5-shell.txt

  Scenario: Reduced-motion shell behavior is honored
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/site-shell.spec.ts --grep "reduced motion"`
    Expected: With `prefers-reduced-motion: reduce`, decorative shell transitions are disabled or reduced without layout breakage
    Evidence: .sisyphus/evidence/task-5-shell-error.txt
  ```

  **Commit**: YES | Message: `feat(shell): add design system and global app shell` | Files: `src/app/layout.tsx`, `src/app/globals.css`, `src/components/shell/*`, `src/test/site-shell.test.*`, `tests/e2e/site-shell.spec.*`

- [ ] 6. Implement the recruiter-facing home page

  **What to do**: Build `/` as a scannable landing page with these sections in order: hero, proof rail, featured case studies, current focus, and direct contact CTA. The hero should foreground Fabrizio's name, current role signal, and differentiated value proposition; the proof rail should surface public credibility markers (Palo Alto, Form Factor shipping, Marcy/non-traditional path) without turning into logo soup; the featured section should show all three case studies as cards that drive deeper reading; and the CTA should route to email/work/resume instead of a form. Add stable selectors `hero-headline`, `hero-subhead`, `proof-rail`, `featured-case-studies`, `case-study-card-form-factor`, `case-study-card-orwell-scraper`, `case-study-card-palo-alto`, and `primary-cta`.
  **Must NOT do**: Do not add skill bars, rotating tag clouds, carousels, auto-playing media, or vague filler copy.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: this page must balance uniqueness with recruiter speed
  - Skills: [] - page composition and motion restraint are the core challenge
  - Omitted: [`frontend-ui-ux`] - the chosen direction is already fixed in the plan

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: T13 | Blocked By: T4, T5

  **References** (executor has NO interview context - be exhaustive):
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - confirms audience priority and featured work
  - Public profile: `https://www.linkedin.com/in/fabrizio-corrales/` - role/timeline signal for hero credibility
  - Public profile: `https://www.marcylabschool.org/people/fabrizio-corrales` - safe journey proof for the proof rail
  - Research source: `https://www.codewonders.dev/` - text-led hero inspiration without generic visuals

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/` renders one visible `h1`, one primary CTA, one proof rail, and exactly three featured case-study cards
  - [ ] All featured cards link to the intended `/work/*` routes
  - [ ] Home page content renders with JavaScript disabled
  - [ ] No progress bars, carousel buttons, or `TBD` text exist on `/`
  - [ ] `pnpm exec playwright test tests/e2e/home.spec.ts` exits `0`

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Home page is scannable and navigable
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/home.spec.ts --grep "home happy path"`
    Expected: The spec confirms `hero-headline`, `proof-rail`, all three case-study cards, and `primary-cta` are visible and linked correctly
    Evidence: .sisyphus/evidence/task-6-home.txt

  Scenario: Home page still works without client-side JavaScript
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/home.spec.ts --grep "no js"`
    Expected: With JavaScript disabled, the page still shows the `h1`, proof rail, featured cards, and CTA links
    Evidence: .sisyphus/evidence/task-6-home-error.txt
  ```

  **Commit**: YES | Message: `feat(home): implement recruiter-facing landing page` | Files: `src/app/page.tsx`, `src/components/sections/home/*`, `tests/e2e/home.spec.*`, supporting tests/styles

- [ ] 7. Implement the work index page

  **What to do**: Build `/work` as a compact, high-signal index of the three selected case studies. Each card must show title, one-sentence summary, role, year/period, tech tags, and a disclosure badge so recruiters can differentiate flagship product work, automation work, and anonymized enterprise work at a glance. Use a filterless layout for V1; prioritize quick comparison over gimmicks. Add stable selectors `work-grid`, `work-page-title`, `case-study-card-form-factor`, `case-study-card-orwell-scraper`, and `case-study-card-palo-alto`.
  **Must NOT do**: Do not add client-side filtering, masonry, hover-only essential copy, or hidden CTA states.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: page layout and information density matter more than complex business logic
  - Skills: [] - standard component composition is enough
  - Omitted: [`frontend-ui-ux`] - no need for a new visual exploration lane

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: T13 | Blocked By: T4, T5

  **References** (executor has NO interview context - be exhaustive):
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - fixed case-study lineup
  - Public repo: `https://github.com/ThyDrSlen/form-factor` - flagship public proof source
  - Public repo: `https://github.com/ThyDrSlen/orwell-scraper` - automation case-study proof source

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/work` renders a visible page title and exactly three case-study cards
  - [ ] Each card exposes summary, role label, tag list, disclosure badge, and destination link
  - [ ] Card links navigate to the expected `/work/*` routes without client-only failures
  - [ ] `pnpm exec playwright test tests/e2e/work-index.spec.ts` exits `0`

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Work index routes into all case studies
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/work-index.spec.ts --grep "work navigation"`
    Expected: The spec opens `/work`, confirms all three cards, and navigates into each linked case-study page successfully
    Evidence: .sisyphus/evidence/task-7-work-index.txt

  Scenario: Work index stays usable on mobile width
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/work-index.spec.ts --grep "mobile"`
    Expected: At a 390px viewport, cards remain readable, tappable, and free from horizontal overflow
    Evidence: .sisyphus/evidence/task-7-work-index-error.txt
  ```

  **Commit**: YES | Message: `feat(work): add work index overview` | Files: `src/app/work/page.tsx`, `src/components/sections/work/*`, `tests/e2e/work-index.spec.*`, supporting styles/tests

- [ ] 8. Implement the about page, resume delivery, and direct contact surface

  **What to do**: Build `/about` as a concise journey page with a short narrative, a readable timeline, current focus, and direct trust links. Surface the non-traditional path and present role without turning the page into a memoir; keep it skimmable for recruiters. Wire the existing `public/resume.pdf` into both nav and page CTA, add direct `mailto:` plus GitHub/LinkedIn links, and ensure the same contact actions appear in the footer. Add selectors `about-page-title`, `journey-timeline`, `resume-download-link`, `contact-email-link`, `social-link-github`, and `social-link-linkedin`.
  **Must NOT do**: Do not add a contact form backend, long autobiography sections, or duplicate the entire resume as wall-of-text content.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: concise story framing and recruiter clarity matter most here
  - Skills: [] - structured copy plus page composition is enough
  - Omitted: [`frontend-ui-ux`] - this is primarily content hierarchy, not visual exploration

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: T13 | Blocked By: T4, T5

  **References** (executor has NO interview context - be exhaustive):
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - confirms recruiter-first scope and no backend form
  - Public profile: `https://www.linkedin.com/in/fabrizio-corrales/` - role/company/date verification
  - Public profile: `https://www.marcylabschool.org/people/fabrizio-corrales` - journey signal and narrative proof
  - Local asset: `public/resume.pdf` - required downloadable resume file

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/about` renders one visible `h1`, timeline section, current-focus section, and direct contact actions
  - [ ] `resume-download-link` downloads `public/resume.pdf`
  - [ ] `contact-email-link` uses `mailto:` and footer/social links resolve to GitHub + LinkedIn
  - [ ] No form elements requiring backend submission exist on `/about`
  - [ ] `pnpm exec playwright test tests/e2e/about.spec.ts` exits `0`

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: About page delivers resume and trust links
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/about.spec.ts --grep "about happy path"`
    Expected: The spec confirms page title, timeline, resume download, mailto CTA, and GitHub/LinkedIn links all work
    Evidence: .sisyphus/evidence/task-8-about.txt

  Scenario: Resume asset is actually served
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/about.spec.ts --grep "resume asset"`
    Expected: The test verifies `/resume.pdf` returns a downloadable PDF response instead of 404 or HTML
    Evidence: .sisyphus/evidence/task-8-about-error.txt
  ```

  **Commit**: YES | Message: `feat(about): add journey resume and contact surface` | Files: `src/app/about/page.tsx`, `src/components/sections/about/*`, `public/resume.pdf`, `tests/e2e/about.spec.*`, supporting tests/styles

- [ ] 9. Build the shared case-study template and route plumbing

  **What to do**: Implement the dynamic case-study route layer under `src/app/work/[slug]/` using `generateStaticParams()` with the fixed slugs from `src/content/`. Create a shared page template and section components that every case study uses in this exact order: hero, problem, role + constraints, system/approach, outcomes, proof links, and reflection. Add a visible disclosure badge and disclaimer block that reads from the case-study schema, support optional media with graceful diagram/text fallback, and call `notFound()` for unknown slugs. Expose selectors `case-study-page`, `case-study-hero`, `case-study-problem`, `case-study-role`, `case-study-constraints`, `case-study-system`, `case-study-outcomes`, `case-study-proof-links`, and `case-study-disclaimer`.
  **Must NOT do**: Do not create three unrelated page designs, add client-only route fetching, or allow unknown slugs to render empty shells.

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: route generation, content contracts, and shared page composition all converge here
  - Skills: [] - standard Next.js routing is sufficient
  - Omitted: [`frontend-ui-ux`] - the task is template consistency, not new art direction

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: T10, T11, T12, T13 | Blocked By: T3, T4, T5

  **References** (executor has NO interview context - be exhaustive):
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - confirms the exact three case studies and anonymized Palo Alto rule
  - Official: `https://nextjs.org/docs/app/getting-started/layouts-and-pages` - App Router route/layout conventions
  - Official: `https://nextjs.org/docs/app/api-reference/functions/generate-metadata` - route content contract must support metadata later

  **Acceptance Criteria** (agent-executable only):
  - [ ] `generateStaticParams()` resolves exactly `form-factor`, `orwell-scraper`, and `palo-alto`
  - [ ] Known slugs render the shared template with all required section selectors
  - [ ] Unknown slugs return a proper Next.js not-found response
  - [ ] Optional case-study media falls back to text/diagram blocks without layout breakage
  - [ ] `pnpm test -- --run src/test/case-study-template.test.tsx` exits `0`

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Shared template renders all known slugs
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/case-study-template.spec.ts --grep "known slugs"`
    Expected: Each known route renders the required section selectors and stable disclosure UI
    Evidence: .sisyphus/evidence/task-9-case-study-template.txt

  Scenario: Unknown slug fails safely
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/case-study-template.spec.ts --grep "unknown slug"`
    Expected: `/work/not-a-real-project` returns the app's not-found experience rather than an empty page or runtime error
    Evidence: .sisyphus/evidence/task-9-case-study-template-error.txt
  ```

  **Commit**: YES | Message: `feat(work): add shared case-study route shell` | Files: `src/app/work/[slug]/*`, `src/components/sections/case-study/*`, `src/test/case-study-template.test.*`, `tests/e2e/case-study-template.spec.*`

- [ ] 10. Ship the Form Factor flagship case study

  **What to do**: Implement `/work/form-factor` using the shared template and position it as the flagship project. The page should highlight the mobile-product angle, real-time form feedback concept, Expo/React Native/TypeScript/Supabase/ARKit/OpenAI stack, shipping cadence/releases, and the product/system tradeoffs that make the work special. Include proof links to the public repo and any safe release/readme surfaces, add a clean architecture/system section rather than a generic screenshot dump, and ensure the reflection explains why the project is valuable to recruiters and peers.
  **Must NOT do**: Do not turn the page into a raw feature checklist, repo README mirror, or uncontrolled media gallery.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: flagship case quality depends on narrative clarity and proof selection
  - Skills: [] - content-driven implementation is the main need
  - Omitted: [`frontend-ui-ux`] - use the shared template and visual system already decided

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: T13 | Blocked By: T9

  **References** (executor has NO interview context - be exhaustive):
  - Source repo: `https://github.com/ThyDrSlen/form-factor` - public project proof and stack details
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - confirms Form Factor as flagship case study

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/work/form-factor` renders hero, problem, role/constraints, system, outcomes, proof links, and reflection sections
  - [ ] The page includes at least two public proof links and one explicit shipping/scale signal drawn from public sources
  - [ ] The page works with and without optional image assets
  - [ ] `pnpm exec playwright test tests/e2e/form-factor.spec.ts` exits `0`

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Flagship case study tells a complete story
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/form-factor.spec.ts --grep "form factor happy path"`
    Expected: The spec confirms all required sections render, proof links are present, and the reflection/CTA are visible
    Evidence: .sisyphus/evidence/task-10-form-factor.txt

  Scenario: Missing media does not break the flagship page
    Tool: Bash
    Steps: Run `pnpm test -- --run src/test/form-factor-fallback.test.tsx`
    Expected: If optional visual assets are omitted, the page still renders fallback diagram/text blocks without crashing
    Evidence: .sisyphus/evidence/task-10-form-factor-error.txt
  ```

  **Commit**: YES | Message: `feat(case-study): add form-factor showcase` | Files: `src/content/*`, `src/app/work/[slug]/*`, `src/components/sections/case-study/*`, `src/test/form-factor-fallback.test.*`, `tests/e2e/form-factor.spec.*`, safe public assets

- [ ] 11. Ship the orwell-scraper technical case study

  **What to do**: Implement `/work/orwell-scraper` as the automation/systems-thinking case study. Frame the page around async scraping design, Playwright + `aiohttp`, pacing/proxy/anti-detection decisions, and what the project demonstrates about reliability and tooling rather than just "scraping images." Keep the copy honest about scope, include public repo proof, and make the outcome section explain why this project earns a slot even next to larger product work.
  **Must NOT do**: Do not oversell the scale, imply unsupported production usage, or bury the technical choices under generic copy.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: this page needs crisp explanation of a smaller but technically interesting project
  - Skills: [] - content framing is more important than novel UI work
  - Omitted: [`frontend-ui-ux`] - reuse the shared case-study system

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: T13 | Blocked By: T9

  **References** (executor has NO interview context - be exhaustive):
  - Source repo: `https://github.com/ThyDrSlen/orwell-scraper` - public technical proof source
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - confirms this project is one of the selected deep dives

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/work/orwell-scraper` renders the shared section set with project-specific copy and proof links
  - [ ] The system section clearly explains async execution, browser automation, and detection-avoidance considerations using public-safe wording
  - [ ] The page provides a clear repo CTA even if no live demo exists
  - [ ] `pnpm exec playwright test tests/e2e/orwell.spec.ts` exits `0`

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Orwell page proves technical depth without a live demo
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/orwell.spec.ts --grep "orwell happy path"`
    Expected: The spec confirms the system/outcomes/proof sections are present and the repo CTA is visible and valid
    Evidence: .sisyphus/evidence/task-11-orwell.txt

  Scenario: Repo-only proof path still feels complete
    Tool: Bash
    Steps: Run `pnpm test -- --run src/test/orwell-proof-links.test.tsx`
    Expected: The test passes only if at least one public proof link exists and the page does not require a live demo asset to render
    Evidence: .sisyphus/evidence/task-11-orwell-error.txt
  ```

  **Commit**: YES | Message: `feat(case-study): add orwell-scraper showcase` | Files: `src/content/*`, `src/app/work/[slug]/*`, `src/test/orwell-proof-links.test.*`, `tests/e2e/orwell.spec.*`, safe public assets

- [ ] 12. Ship the anonymized Palo Alto Networks case study

  **What to do**: Implement `/work/palo-alto` as an anonymized enterprise case study that signals domain maturity without revealing confidential details. Use public-safe framing only: company is allowed, but the page should focus on domain, responsibilities, architectural thinking, collaboration, and outcomes at an abstracted level. Render a highly visible disclosure badge and disclaimer, prefer diagrams/text blocks over screenshots, and explain the anonymization choice directly so the page feels intentional rather than empty.
  **Must NOT do**: Do not include internal UI screenshots, customer names, product codenames, confidential metrics, or claims that cannot be supported publicly.

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: privacy-safe storytelling is the core challenge here
  - Skills: [] - disciplined content framing matters more than complex logic
  - Omitted: [`frontend-ui-ux`] - this should stay within the shared case-study system

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: T13 | Blocked By: T9

  **References** (executor has NO interview context - be exhaustive):
  - Public profile: `https://www.linkedin.com/in/fabrizio-corrales/` - company/role verification only
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - confirms this page must remain anonymized and public-safe

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/work/palo-alto` renders the shared template plus a visible disclosure badge and disclaimer
  - [ ] The page contains no screenshot gallery and no forbidden terms/assets from the disclosure matrix
  - [ ] The page still communicates problem space, role, approach, and outcomes in a useful recruiter-friendly way
  - [ ] `pnpm exec playwright test tests/e2e/palo-alto.spec.ts` exits `0`

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Palo Alto case study is useful and clearly anonymized
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/palo-alto.spec.ts --grep "palo alto happy path"`
    Expected: The spec confirms the disclosure badge, disclaimer, required shared sections, and CTA are all visible
    Evidence: .sisyphus/evidence/task-12-palo-alto.txt

  Scenario: Unsafe assets or forbidden words are blocked
    Tool: Bash
    Steps: Run `pnpm test -- --run src/test/palo-alto-sanitization.test.ts src/test/palo-alto-assets.test.ts`
    Expected: Tests pass only if forbidden terms/assets are absent and screenshot-only layouts cannot render
    Evidence: .sisyphus/evidence/task-12-palo-alto-error.txt
  ```

  **Commit**: YES | Message: `feat(case-study): add palo-alto anonymized showcase` | Files: `src/content/*`, `src/app/work/[slug]/*`, `src/test/palo-alto-assets.test.*`, `tests/e2e/palo-alto.spec.*`, safe abstract assets

- [ ] 13. Add metadata, structured data, sitemap, robots, and social cards

  **What to do**: Implement route-aware metadata for `/`, `/work`, `/about`, and every `/work/[slug]` page using the content schema as the source of truth. Set `metadataBase` to apex `https://slen.win`, generate canonical URLs, create OG/Twitter card support with text-led images that match the tech-lab visual system, add favicon/app-icon assets, and add `src/app/sitemap.ts` plus `src/app/robots.ts` for the fixed V1 route set. Add JSON-LD for `Person` on the core identity pages and `CreativeWork` on case-study routes; ensure unknown slugs are excluded from sitemap output and do not emit shareable metadata. Expand Lighthouse CI from the home route to `/` plus `/work/form-factor` once the real case-study page exists.
  **Must NOT do**: Do not hardcode `localhost` URLs, leave default Next.js metadata, or include non-existent routes/blog pages in sitemap output.

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: metadata correctness depends on route/content integration and exact SEO rules
  - Skills: [] - built-in Next.js metadata APIs are sufficient
  - Omitted: [`frontend-ui-ux`] - this is metadata plumbing, not visual experimentation

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: T14 | Blocked By: T6, T7, T8, T9, T10, T11, T12

  **References** (executor has NO interview context - be exhaustive):
  - Official: `https://nextjs.org/docs/app/api-reference/functions/generate-metadata` - metadata API contract
  - Official: `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image` - OG image generation
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - confirms apex-domain canonical policy and fixed route list

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/`, `/work`, `/about`, and all three case-study routes emit title, description, canonical, Open Graph, and Twitter metadata
  - [ ] Favicon/app icon assets resolve correctly for the built site
  - [ ] `sitemap.xml` contains exactly the fixed V1 public routes and excludes unknown slugs
  - [ ] `robots.txt` allows indexing for public routes and points to the generated sitemap
  - [ ] JSON-LD is present on home/about and case-study pages with the expected schema type
  - [ ] `pnpm lighthouse` exits `0` against `/` and `/work/form-factor`
  - [ ] `pnpm exec playwright test tests/e2e/metadata.spec.ts` exits `0`

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Public routes expose correct metadata
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/metadata.spec.ts --grep "metadata happy path"`
    Expected: The spec confirms title, description, canonical, OG tags, and JSON-LD on `/`, `/about`, and one case-study route
    Evidence: .sisyphus/evidence/task-13-metadata.txt

  Scenario: Sitemap and not-found behavior stay tight
    Tool: Bash
    Steps: Run `pnpm exec playwright test tests/e2e/metadata.spec.ts --grep "sitemap and unknown slug"`
    Expected: Only intended V1 routes appear in `sitemap.xml`, and `/work/not-a-real-project` is excluded and resolves to not-found behavior
    Evidence: .sisyphus/evidence/task-13-metadata-error.txt

  Scenario: Lighthouse covers the final route set
    Tool: Bash
    Steps: Run `pnpm lighthouse`
    Expected: Lighthouse CI passes using `/` and `/work/form-factor` with the configured numeric thresholds
    Evidence: .sisyphus/evidence/task-13-metadata-lighthouse.txt
  ```

  **Commit**: YES | Message: `feat(seo): add metadata og sitemap robots and structured data` | Files: `src/app/sitemap.ts`, `src/app/robots.ts`, route metadata files, OG image files/components, metadata tests

- [ ] 14. Configure GitHub, Vercel, and domain launch gates

  **What to do**: Create or connect a GitHub repository named `slen-portfolio` under `ThyDrSlen`, keep `main` as the production default branch, push `feat/slen-portfolio`, and merge to `main` only after CI is green. Then connect the repo to Vercel as the hosting target. Set production canonical URL to `https://slen.win`, add both `slen.win` and `www.slen.win` in Vercel, configure `www` to redirect to apex, and set `NEXT_PUBLIC_SITE_URL=https://slen.win` in local and Vercel environments. Keep V1 analytics off. Produce a reproducible deployment state: green CI, successful production build, live production URL, and working resume download/domain redirects.
  **Must NOT do**: Do not deploy from an untracked local-only folder, leave `NEXT_PUBLIC_SITE_URL` unset, point canonical to `www`, or enable analytics/contact backends as opportunistic extras.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: this is mostly deterministic hosting/repo wiring once the app is done
  - Skills: [`git-master`] - useful for remote setup and clean push flow
  - Omitted: [`frontend-ui-ux`] - no visual work belongs here

  **Parallelization**: Can Parallel: NO | Wave 5 | Blocks: F1, F2, F3, F4 | Blocked By: T2, T13

  **References** (executor has NO interview context - be exhaustive):
  - Official: `https://vercel.com/docs/domains/set-up-custom-domain` - required domain attachment workflow
  - Official: `https://vercel.com/docs/domains/working-with-domains/add-a-domain` - `slen.win` + `www.slen.win` configuration
  - Plan file: `.sisyphus/plans/slen-portfolio.md` - confirms Vercel default, apex canonical, and no analytics in V1
  - Public profile: `https://github.com/ThyDrSlen` - target GitHub owner for repo creation

  **Acceptance Criteria** (agent-executable only):
  - [ ] GitHub remote exists and the working branch is pushed successfully
  - [ ] `main` is the default production branch and receives the merged, green CI version of the site
  - [ ] Vercel project is linked to the repo and production deployment completes successfully
  - [ ] `NEXT_PUBLIC_SITE_URL=https://slen.win` is configured for local + production
  - [ ] `https://slen.win` returns `200`, `https://www.slen.win` redirects to apex, and `https://slen.win/resume.pdf` returns the PDF asset
  - [ ] CI is green on the connected repo default branch or protected integration branch used for production

  **QA Scenarios** (MANDATORY - task incomplete without these):
  ```text
  Scenario: Production deployment is healthy
    Tool: Bash
    Steps: Run `git remote -v`; run `git push -u origin feat/slen-portfolio`; merge the green branch into `main`; run the chosen Vercel deploy command or linked production deployment; run `curl -I https://slen.win`; run `curl -I https://slen.win/resume.pdf`
    Expected: Remote exists, push succeeds, the green branch lands on `main`, deploy succeeds, apex returns `200`, and resume asset returns a PDF response
    Evidence: .sisyphus/evidence/task-14-deploy.txt

  Scenario: Domain redirect behavior is correct
    Tool: Bash
    Steps: Run `curl -I https://www.slen.win`
    Expected: `www` responds with a redirect to `https://slen.win` rather than serving duplicate canonical content
    Evidence: .sisyphus/evidence/task-14-deploy-error.txt
  ```

  **Commit**: YES | Message: `chore(deploy): connect github vercel and slen-win launch config` | Files: remote repo config, Vercel-linked project state, env config, any minimal deploy config files




## Final Verification Wave (MANDATORY - after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.
> Never mark F1-F4 as checked before getting user's okay. Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.
- [ ] F1. Plan Compliance Audit - oracle

  **What to do**: Run an oracle review against the finished implementation and this plan, then produce a pass/fail checklist that explicitly covers routes, featured projects, visual guardrails, content-source rules, and V1 exclusions.
  **Acceptance Criteria**:
  - [ ] Oracle report maps T1-T14 to pass/fail findings with file/path evidence
  - [ ] No required route, case study, or guardrail is missing from the shipped implementation
  - [ ] Any deviation is written as a concrete fix list, not vague commentary

  **QA Scenarios**:
  ```text
  Scenario: Oracle verifies full plan compliance
    Tool: Task (oracle)
    Steps: Run oracle against the completed repo using `.sisyphus/plans/slen-portfolio.md` as the source plan and the final changed files as implementation evidence
    Expected: Oracle returns an approval or a task-by-task defect list covering T1-T14, routes, and scope boundaries
    Evidence: .sisyphus/evidence/f1-plan-compliance.md
  ```

- [ ] F2. Code Quality Review - unspecified-high

  **What to do**: Run a high-scrutiny code review across the final diff with emphasis on maintainability, TypeScript safety, component boundaries, dependency discipline, test quality, and accessibility implementation.
  **Acceptance Criteria**:
  - [ ] Reviewer confirms no obvious architectural debt, dead code, or unsafe typing shortcuts remain
  - [ ] Reviewer confirms tests meaningfully cover schemas/routes/metadata rather than only superficial snapshots
  - [ ] Reviewer either approves or emits an actionable fix list with file-level evidence

  **QA Scenarios**:
  ```text
  Scenario: High-scrutiny code review runs on final diff
    Tool: Task (unspecified-high)
    Steps: Run a code review agent on the completed repo after `pnpm lint`, `pnpm typecheck`, `pnpm test -- --run`, `pnpm test:e2e`, `pnpm lighthouse`, and `pnpm build` are green
    Expected: Reviewer approves or returns concrete file-specific issues tied to maintainability, accessibility, or test quality
    Evidence: .sisyphus/evidence/f2-code-quality.md
  ```

- [ ] F3. Real Manual QA - unspecified-high (+ playwright if UI)

  **What to do**: Execute browser-driven QA on the production-like build for desktop, mobile, reduced-motion, and no-JS behavior across `/`, `/work`, all three case-study routes, `/about`, and `/resume.pdf`.
  **Acceptance Criteria**:
  - [ ] QA report covers desktop and mobile viewports, keyboard flow, reduced motion, and resume download
  - [ ] Every public route loads, navigates, and renders the intended primary CTA without runtime errors
  - [ ] Failures include reproduction steps, route, viewport, and evidence assets

  **QA Scenarios**:
  ```text
  Scenario: Browser QA covers the full public route set
    Tool: Task (unspecified-high) + Playwright
    Steps: Run browser QA against the final local production build or deployed URL for `/`, `/work`, `/work/form-factor`, `/work/orwell-scraper`, `/work/palo-alto`, `/about`, and `/resume.pdf`
    Expected: QA returns approval only if all routes work on desktop/mobile, keyboard navigation is sound, reduced motion is honored, and resume download succeeds
    Evidence: .sisyphus/evidence/f3-real-qa.md
  ```

- [ ] F4. Scope Fidelity Check - deep

  **What to do**: Run a deep scope review that checks for both under-delivery and over-build. Confirm the shipped site includes the required pages and case studies, while excluding blog/CMS/search/contact backend/analytics and other forbidden extras.
  **Acceptance Criteria**:
  - [ ] Reviewer confirms the final build includes all required V1 features and excludes all V1-forbidden features
  - [ ] Reviewer confirms the visual direction remains tech-lab minimal and recruiter-scannable rather than drifting into generic or over-designed territory
  - [ ] Any scope creep is documented with exact files/routes responsible

  **QA Scenarios**:
  ```text
  Scenario: Deep reviewer checks for missing scope and unauthorized extras
    Tool: Task (deep)
    Steps: Run deep review against the final implementation using `.sisyphus/plans/slen-portfolio.md` to compare required routes/features and forbidden features/extras
    Expected: Reviewer approves only if required scope is complete and no blog, CMS, search, analytics, or contact backend has slipped into V1
    Evidence: .sisyphus/evidence/f4-scope-fidelity.md
  ```

## Commit Strategy
- `chore(init): scaffold next portfolio workspace`
- `test(tooling): add vitest playwright axe and lighthouse gates`
- `feat(content): define typed site content and disclosure schema`
- `feat(content): ingest resume and public-safe case-study copy`
- `feat(shell): add design system and global app shell`
- `feat(home): implement recruiter-facing landing page`
- `feat(work): add work index overview`
- `feat(about): add journey resume and contact surface`
- `feat(work): add shared case-study route shell`
- `feat(case-study): add form-factor showcase`
- `feat(case-study): add orwell-scraper showcase`
- `feat(case-study): add palo-alto anonymized showcase`
- `feat(seo): add metadata og sitemap robots and structured data`
- `chore(deploy): connect github vercel and slen-win launch config`

## Success Criteria
- `slen.win` loads a distinctive but fast portfolio that a recruiter can scan in under 90 seconds
- Every public page has valid metadata, one visible `h1`, working nav, and a clear next action
- The three selected case studies feel materially different and prove product, automation, and enterprise experience respectively
- The Palo Alto story is valuable without leaking protected details
- The repo is fully reproducible from scratch with `pnpm install` and the baseline quality scripts
- Final verification agents approve scope, quality, QA, and plan compliance before completion

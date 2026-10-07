# therealheroesofecommerce.com

GitHub Pages + Jekyll. Push to `main` = live in ~1 min. No local build needed.
Always `git pull` before starting — Shep edits and commits from his own machine.

Marketing site for a boutique CRO agency (Shep + one other person), built
around the Snapshot CRO Shopify app.

**Pause mode ended (2026-10)**: the Substack redirect stub and
`preview-home.html` are gone. `index.html` IS the live homepage again —
make homepage changes there.

## Current facts (don't reintroduce stale numbers)

- App: **Snapshot CRO**, `https://apps.shopify.com/snapshot-cro` (old
  `/mousewhisperer` handle is dead). Pricing: starter (free) + advanced
  $199/mo with a 30-day trial. No middle tier.
- CRO service: pricing is "based on scope" — the public $3,000/mo
  reference price was removed 2026-09-12 (Shep's call). Don't reintroduce
  a number without asking.
- Substack (`heroesofecommerce.substack.com`) is the email delivery channel
  only; this site is the canonical content home.

## Pages

- `index.html` — homepage. Wide canvas, two-column hero (`hero-booth.png`),
  three-card grid: app / newsletter / CRO services. Tokens mirror
  `snapshot/assets/css/style.css` so the two feel like one site.
- `snapshot/index.html` — the Snapshot CRO product page, with its own
  `assets/css/style.css`, `assets/js/grid.js`, card images under
  `assets/img/cards/`, and `data/items.json` + `data/questions.json`
  driving the card grid and modals. Replaced the old root
  `snapshot-cro.html` (deleted 2026-10 — don't resurrect it).
- `hire-cro-agency.html` — the CRO service page (redesigned 2026-10).
- `snapshot-insights.html` — long-form page on what the app surfaces.
- `newsletter.html` — newsletter hub (latest issues + year-grouped archive).
- `snapshot-privacy-policy.html` — the app's privacy policy, and the only
  one there is. `privacy-policy.html` is NOT a second policy: it is a
  redirect stub left at the old URL because that address is probably
  registered as the app's privacy link in the Shopify Partner Dashboard,
  where a 404 is a review problem. Delete it once that listing is
  repointed. It keeps the pre-redesign styling on purpose (Shep's call).

## Assets (root, all transparent PNG, Shep's own art)

- `logo.png` — 1000x225 wordmark. It sets its text on TWO lines beside
  the mascot, so the type is small for the canvas: each line is 81px
  where the earlier one-line mark was 135px. Header sizing is tuned to
  that (240px wide, 54px tall), not to the ratio — swap in a one-line
  mark and it will look oversized.
- `favicon.png` — 64x64 pixel face, the icon on every page but
  `/snapshot/`, which keeps the app's own.
- `hero-booth.png` — 1000x1000 illustration in the homepage hero.
- `heroes-lineup.png` — the old hero band, unused but kept.

## Content collections

- `_newsletter/*.html` → `/newsletter/<slug>/`, layout `newsletter`, hub
  `newsletter.html`. Migrated + future Substack issues. Docs are cleaned
  HTML (not markdown) wrapped in `{% raw %}`; front matter: `title`,
  `description`, `date`, `substack_url`. Content is verbatim — the casing
  rule below does NOT apply.
- `_layouts/newsletter.html` wraps posts in the site shell (header, nav,
  dateline, subscribe CTA, backlink) — restyled 2026-10 to match the
  homepage.
- Perspectives (republished pieces by other writers) was removed entirely
  2026-09-28 (Shep's call) — don't resurrect it from git history. If it
  ever comes back, republishing someone else's piece needs their written
  consent first.
- Migration script: `.claude/scripts/migrate_substack.py` (takes the
  Substack export zip).
- `_includes/subscribe-email.html` is the email-capture form (posts email
  only to the same Apps Script endpoint as the CRO lead form), used on the
  homepage, the newsletter hub, and the newsletter layout.
- SEO stance: migrated newsletter pages self-canonicalize via `{% seo %}`.
  The Substack copies stay live and also self-claim (Substack can't emit
  cross-domain canonicals). This is intentional — do not "fix" it with
  noindex or by deleting either copy.

## Workshop data decisions

- Scale target is ~100 low-concurrency users: Google Sheets + Apps Script
  is the right backend — do NOT propose Firebase/Supabase/auth systems.
- Email-as-identity is fine (Shep's explicit call, 2026-09-11): no
  passwords, honor system. Nothing sensitive is collected.
- Each workshop session gets its OWN Apps Script deployment + sheet
  (Shep's call, 2026-09-15) — with one deliberate exception, session
  four, which reuses the roadmaps deployment (see below).
  Pace workshop → `rhoe-workshop-submissions`
  (`ENDPOINT` in workshop.js, answers.html); analytics workshop →
  `rhoe-analytics-workshop-submissions` (`ANALYTICS_ENDPOINT`,
  analytics-answers.html); expert review & roadmaps workshop (session 3,
  `roadmaps.html` + `review-*.html`) → `rhoe-roadmaps-workshop-submissions`
  (`ROADMAPS_ENDPOINT`; the PDP review is one page, review-pdp.html,
  saved to localStorage as they click and sent as one `pdp-review` row).
  Session three v2 (`er-*.html`, 2026-09-29) is the CXL-style PACE expert
  review. It starts at er-ad.html: attendees pick one of six brands
  (Meta Ad Library links), record the ad's hook/offer/format and where
  it landed, and paste the PDP url — that prefills setup and shows on
  the A page. Then one page per stage (P/A/C/E), each with notes + a 1–10 urgency
  scale, stored under `workshop_review_pace` (key order in
  `REVIEW_ORDERS`, workshop.js), sent from er-e.html as one `pace-review`
  row to the same `ROADMAPS_ENDPOINT`; er-prioritize.html ranks the four
  stages as drag cards. Bonus round: er-feedback.html turns
  customer feedback (on-page/Google reviews, Meta comments, Reddit,
  support tickets) into individual tasks (stage + source + 1–10
  urgency, kept in localStorage `workshop_feedback_tasks`, sent as one
  `pace-feedback` row); er-prioritize-2.html is round 2 — the stages
  plus those tasks, starting from the round-1 order. Both prioritize
  pages share er-prioritize.js. er-conclusion.html closes the deck.
  v2 is the live session: the workshop contents page links only er.html
  (2026-09-29); v1 pages still exist but are unlisted. Don't consolidate
  them; follow the same pattern for future sessions (script template:
  `.claude/scripts/analytics-workshop-apps-script.gs`).
- Session four (`bl-*.html` + `confidence.html`, 2026-10-07) is
  **The Backlog: Priorities & Confidence** — how to build a CRO program.
  Twelve slides, structured as three gates: which page to work on
  (traffic x weakness), what to test on it (findings -> hypotheses ->
  ICE), and whether you can learn anything (sample size / MDE).
  It **stands alone on a shared mock store** — Shep's call, 2026-10-07:
  it deliberately does NOT read session three's localStorage, so
  everyone works the same numbers and the discussion is comparable.
  Entry point is `confidence.html` (kept at that filename because the
  contents page and deck table already point there; its title is
  "The Backlog").
  - The mock store is "Northbound Supply", 8 pages, embedded directly
    in `bl-store.html` and `bl-priority.html`. **The weakness /
    opportunity / priority / confidence scores are computed from
    Snapshot's real formulas** in `scorePageAggregate`,
    `app/utils/store-snapshot.server.ts` of the **sibling**
    `mousewhisperer` repo (one level up from this one — the app source
    is NOT in heroes-site). They are not invented: the whole exercise
    is attendees auditing them, so don't hand-edit a number without
    recomputing the rest. Three traps are load-bearing: the top-ranked
    page has 42 sessions (because `trafficScore` saturates at 20
    sessions and revenue at $1,000, so `priority` collapses into
    "weakness, halved"), a blog post ties a $890/mo product page, and a
    policy page is penalised for a high exit rate. Every page reads
    100% confidence because that figure is just `sessions / 30`.
  - `bl-pdp.html` converges everyone on the Trail Runner 2 PDP. Its
    five mock cards cross-foot against the store table (1,911 visits ->
    1,204 real -> 51 add-to-cart -> 13 orders -> $2,412); keep them
    consistent if you edit any of it.
  - Answers live in localStorage `workshop_review_backlog` (key order in
    `REVIEW_ORDERS`, workshop.js). Two rows go to the **existing
    `ROADMAPS_ENDPOINT`** via `data-endpoint="roadmaps"`: `backlog-review`
    (all 23 keys, sent from bl-route.html) and `backlog-order` (the
    ranked list, sent from bl-backlog.html). The roadmaps Apps Script
    makes one tab per exercise and appends unknown answer keys as new
    columns, so **no script or endpoint change was needed** — that is
    why session four has no deployment of its own.
  - `workshop/bl.js` loads after workshop.js on four slides and
    self-guards on `#ice` (live ICE readout), `#mde` (sample-size
    calculator, 16*p*(1-p)/(p*lift)^2 at 95%/80%), and `#cards`
    (drag-rank, `workshop_priorities_backlog`, plus the read-only
    conclusion + CSV export). It mirrors `er-prioritize.js` — keep them
    structurally similar rather than merging them.
- Slide order per session lives in the deck table at the top of
  `workshop/workshop.js` — add new pages there, not just as links.
- The contents page is `workshop/index.html` (`/workshop/`).
  `workshop/contents.html` is a noindex redirect stub to it.

## Style

Two distinct looks. Don't mix them.

**Marketing pages** (`index.html`, `snapshot/`, `hire-cro-agency.html`,
`snapshot-insights.html`, `newsletter.html`, the newsletter layout) —
redesigned 2026-10 as a real site: Space Grotesk, wide canvas, cards,
pill buttons. Normal capitalization throughout, including nav items and
buttons ("Snapshot CRO", "Newsletter", "Work with us", "Install on
Shopify") — Shep's call, 2026-10-05. Don't lowercase them.

**Workshop pages** (`workshop/*`) — still the rendered-markdown/terminal
document look (IBM Plex Mono/Sans, `workshop/style.css`). The casing rules
there:

- **Section headings** (`<h1>` with the `## ` prefix): all lowercase —
  "how we work with clients", "notable posts"
- **Bullets / list items**: start lowercase
- **Taglines** (`// ...`): all lowercase (proper nouns keep caps)
- **Link labels + `(notes)`** in lists: lowercase
- **Page titles** (`h1.title`) and `<title>`/meta tags: normal
  capitalization — "Snapshot CRO", "Conclusion"
- **Paragraph body text**: normal sentence case
- **Proper nouns** (Shopify, Snapshot CRO, Google) keep their
  capitalization everywhere

Shep writes with auto-capitalizing tools and pastes copy in inconsistently —
normalizing pasted copy to the destination page's pattern is Claude's job,
every time.

**Typos in Shep's copy**: fix a missing word or mis-capitalization that
breaks the meaning. Do NOT "fix" grammatical quirks that could be
deliberate, or creative spellings ("secret layer", "tons of nonsense") —
when in doubt, keep it verbatim and flag it instead.

**Newsletter lists**: the old "show ALL posts uncapped" homepage panel
went away with the 2026-10 redesign. Now the homepage card shows the
latest 6 (`index.html`, `limit: 6`) and the hub shows the latest 3 plus
the full year-grouped archive, which IS uncapped (`newsletter.html`).
Keep the archive complete — the length "shows commitment" (Shep).

**EXCEPTION: newsletter posts** (`_newsletter/*.html`) keep their exact
source formatting and capitalization. Never restyle article content.

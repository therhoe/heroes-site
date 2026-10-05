# therealheroesofecommerce.com

GitHub Pages + Jekyll. Push to `main` = live in ~1 min. No local build needed.

**Homepage**: pause mode ended 2026-10-05. `index.html` is the real
homepage again (the Substack redirect stub and `preview-home.html` are
both gone — don't restore either from git history). It is built to the
same shape as `/snapshot/` — 1200px canvas, sticky header with a CTA
pill, big hero, then a card grid — because the stacked 728px column read
as a document rather than a site. Ground stays white (Shep: that's the
RHOE brand and it doesn't move) and the type is Space Grotesk, not IBM
Plex Mono, so the homepage is the one page off the terminal aesthetic.
Assets (all transparent PNG, Shep's own art, 2026-10-05): `logo.png`
is the wordmark at 1000x225 (4.4:1 — it replaced a 9.4:1 one, so header
sizing is tuned to it), `favicon.png` is the 64x64 pixel face, and
`hero-booth.png` is the 1000x1000 illustration in the two-column hero.
`heroes-lineup.png` is the old hero band, now unused but kept.
The snapshot green `#85ff97` cannot carry text on white — use it only as
a highlight behind dark text, or as a border. Each of the three cards is
skinned like the page it opens onto (app = black/green, newsletter =
paper, services = yellow accent). The subscribe include is shared with
the terminal pages, so restyle it from `index.html` scoped under
`.card-news`, never in `_includes/subscribe-email.html`.

Marketing site for a boutique CRO agency (Shep + one other person), built
around the Snapshot CRO Shopify app.

## Current facts (don't reintroduce stale numbers)

- App: **Snapshot CRO**, `https://apps.shopify.com/snapshot-cro` (old
  `/mousewhisperer` handle is dead). Pricing: starter (free) + advanced
  $199/mo with a 30-day trial. No middle tier.
- CRO service: pricing is "based on scope" — the public $3,000/mo
  reference price was removed 2026-09-12 (Shep's call). Don't reintroduce
  a number without asking.
- Substack (`heroesofecommerce.substack.com`) is the email delivery channel
  only; this site is the canonical content home.

## Content collections

- `_newsletter/*.html` → `/newsletter/<slug>/`, layout `newsletter`, hub
  `newsletter.html`. Migrated + future Substack issues. Docs are cleaned
  HTML (not markdown) wrapped in `{% raw %}`; front matter: `title`,
  `description`, `date`, `substack_url`. Content is verbatim — the casing
  rule below does NOT apply.
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
  (Shep's call, 2026-09-15). Pace workshop → `rhoe-workshop-submissions`
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
  plus those tasks, starting from the round-1 order. er-conclusion.html
  is the last slide: the round-2 order read-only, plus "copy for Google
  Sheets" (paste into their own sheet — no Google sign-in) and "download
  .csv". All three pages share er-prioritize.js. v2 is the live session: the workshop
  contents page links only er.html (2026-09-29); v1 pages still exist
  but are unlisted. Don't consolidate them; follow the same
  pattern for future sessions (script template:
  `.claude/scripts/analytics-workshop-apps-script.gs`).

## Site style rule (apply to ALL pages)

The site mimics a rendered markdown/terminal document. Casing rules:

- **Section headings** (`<h1>` with the `## ` prefix): all lowercase — "how we work with clients", "notable posts"
- **Bullets / list items**: start lowercase
- **Taglines** (`// ...`): all lowercase (proper nouns keep caps)
- **Link labels + `(notes)`** in lists: lowercase
- **Nav menu items and pill buttons**: normal capitalization (Shep's
  call, 2026-10-05) — "Snapshot CRO", "Newsletter", "Work with us",
  "Install on Shopify". This is buttons and nav only; link labels inside
  lists stay lowercase per the rule above.
- **Page titles** (`h1.title`) and `<title>`/meta tags: normal capitalization — "Snapshot CRO", "CRO Service"
- **Paragraph body text**: normal sentence case
- **Proper nouns** (Shopify, Snapshot CRO, Google) keep their capitalization everywhere

Shep writes with auto-capitalizing tools and pastes copy in inconsistently —
normalizing pasted copy to this pattern is Claude's job, every time.

**Typos in Shep's copy**: fix a missing word or mis-capitalization that
breaks the meaning. Do NOT "fix" grammatical quirks that could be
deliberate, or creative spellings ("secret layer", "tons of nonsense") —
when in doubt, keep it verbatim and flag it instead.

**Long lists**: the newsletter hub (`newsletter.html`, `/newsletter/`)
deliberately shows ALL posts uncapped — the length "shows commitment"
(Shep). Don't truncate, paginate, or scroll-cap it there. It was
restyled to the homepage's shape 2026-10-05 and the rule still holds:
every issue renders into the document, grouped by year, and the search +
year chips only ever set `hidden` on rows — they never drop them. The
two sticky layers (header, controls) measure their own heights into
`--header-h` / `--controls-h` because the chips wrap at narrow widths;
don't replace that with hardcoded offsets. The homepage
door shows only the 8 most recent plus an "all N issues" link (Shep's
call, 2026-10-05) so the three doors stay balanced. That's specific to
the newsletter archive; don't assume other sections want the same.

**EXCEPTION: newsletter posts** (`_newsletter/*.html`) keep their exact
source formatting and capitalization. Never restyle article content.
(`_layouts/newsletter.html` was brought onto the site's shell
2026-10-05 — that is presentation only; the post HTML itself is
untouched. The article body deliberately stays Spectral serif at 725px
while all the chrome is Space Grotesk: a long read wants a serif, and
these were written and sent in one. One font-family rule reverts it.)

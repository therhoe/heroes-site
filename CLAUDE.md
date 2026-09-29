# therealheroesofecommerce.com

GitHub Pages + Jekyll. Push to `main` = live in ~1 min. No local build needed.

**PAUSE MODE (since 2026-09-15)**: the homepage (`index.html`) is a
redirect stub to the Substack while Shep reworks the site in the
background. The real homepage lives at `preview-home.html` — make all
homepage changes THERE. Deeper URLs (workshop, newsletter, learn) stay
live and unaffected. To relaunch: copy preview-home back to index.html
(minus the preview banner / noindex / sitemap:false), delete the stub.

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
  review: one page per stage (P/A/C/E), each with notes + a 1–5 urgency
  star rating, stored under `workshop_review_pace` (key order in
  `REVIEW_ORDERS`, workshop.js), sent from er-e.html as one `pace-review`
  row to the same `ROADMAPS_ENDPOINT`; er-prioritize.html ranks the four
  stages as drag cards. v1 stays up alongside it. Don't consolidate them; follow the same
  pattern for future sessions (script template:
  `.claude/scripts/analytics-workshop-apps-script.gs`).

## Site style rule (apply to ALL pages)

The site mimics a rendered markdown/terminal document. Casing rules:

- **Section headings** (`<h1>` with the `## ` prefix): all lowercase — "how we work with clients", "notable posts"
- **Bullets / list items**: start lowercase
- **Taglines** (`// ...`): all lowercase (proper nouns keep caps)
- **Link labels + `(notes)`** in lists: lowercase
- **Page titles** (`h1.title`) and `<title>`/meta tags: normal capitalization — "Snapshot CRO", "CRO Service"
- **Paragraph body text**: normal sentence case
- **Proper nouns** (Shopify, Snapshot CRO, Google) keep their capitalization everywhere

Shep writes with auto-capitalizing tools and pastes copy in inconsistently —
normalizing pasted copy to this pattern is Claude's job, every time.

**Typos in Shep's copy**: fix a missing word or mis-capitalization that
breaks the meaning. Do NOT "fix" grammatical quirks that could be
deliberate, or creative spellings ("secret layer", "tons of nonsense") —
when in doubt, keep it verbatim and flag it instead.

**Long lists**: the homepage newsletter panel deliberately shows ALL
posts uncapped — the length "shows commitment" (Shep). Don't truncate,
paginate, or scroll-cap it. That's specific to the newsletter archive;
don't assume other sections want the same.

**EXCEPTION: newsletter posts** (`_newsletter/*.html`) keep their exact
source formatting and capitalization. Never restyle article content.

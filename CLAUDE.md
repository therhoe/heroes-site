# therealheroesofecommerce.com

GitHub Pages + Jekyll. Push to `main` = live in ~1 min. No local build needed.

Marketing site for a boutique CRO agency (Shep + one other person), built
around the Snapshot CRO Shopify app.

## Current facts (don't reintroduce stale numbers)

- App: **Snapshot CRO**, `https://apps.shopify.com/snapshot-cro` (old
  `/mousewhisperer` handle is dead). Pricing: starter (free) + advanced
  $199/mo with a 30-day trial. No middle tier.
- CRO service: ongoing engagements start around $3,000/mo (stated publicly
  on `hire-cro-agency.html` on purpose — it filters leads).
- Substack (`heroesofecommerce.substack.com`) is the email delivery channel
  only; this site is the canonical content home.

## Content collections

- `_newsletter/*.html` → `/newsletter/<slug>/`, layout `newsletter`, hub
  `newsletter.html`. Migrated + future Substack issues. Docs are cleaned
  HTML (not markdown) wrapped in `{% raw %}`; front matter: `title`,
  `description`, `date`, `substack_url`. Content is verbatim — the casing
  rule below does NOT apply.
- `_perspectives/*.html` → `/perspectives/<slug>/`, layout `perspective`,
  hub `perspectives.html` (card list). This is the SECOND incarnation
  (2026-09-12): other writers' pieces republished WITH WRITTEN CONSENT,
  Shep's intro/commentary above the piece (site voice, no frame), the
  article itself in the rhoe-post paper card, `source_url` front matter
  emits rel=canonical to the original. Front matter: title, author, date,
  source_url, description (card blurb), intro (multiline, markdownified).
  Never publish a piece without Shep confirming he has the writer's
  consent. (The first incarnation — Shep's own Google-Doc articles — was
  deleted 2026-09-06; don't resurrect those from git history.)
- Migration script: `.claude/scripts/migrate_substack.py` (takes the
  Substack export zip).
- `_includes/subscribe-email.html` is the email-capture form (posts email
  only to the same Apps Script endpoint as the CRO lead form), used on the
  homepage, the newsletter hub, and both article layouts.
- SEO stance: migrated newsletter pages self-canonicalize via `{% seo %}`.
  The Substack copies stay live and also self-claim (Substack can't emit
  cross-domain canonicals). This is intentional — do not "fix" it with
  noindex or by deleting either copy.

## Workshop data decisions

- Scale target is ~100 low-concurrency users: Google Sheets + Apps Script
  is the right backend — do NOT propose Firebase/Supabase/auth systems.
- Email-as-identity is fine (Shep's explicit call, 2026-09-11): no
  passwords, honor system. Nothing sensitive is collected.

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

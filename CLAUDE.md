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

- `_perspectives/*.md` → `/perspectives/<slug>/`, layout `perspective`,
  hub `perspectives.html`. Evergreen articles from Google Docs
  (see `.claude/skills/publish-perspective/SKILL.md`).
- `_newsletter/*.html` → `/newsletter/<slug>/`, layout `newsletter`, hub
  `newsletter.html`. Migrated + future Substack issues. Docs are cleaned
  HTML (not markdown) wrapped in `{% raw %}`; front matter: `title`,
  `description`, `date`, `substack_url`. Content is verbatim — the casing
  rule below does NOT apply, same as perspectives.
- Migration script: `.claude/scripts/migrate_substack.py` (takes the
  Substack export zip).
- `_includes/subscribe-substack.html` is the email-capture embed, used on
  the homepage and both article layouts.
- SEO stance: migrated newsletter pages self-canonicalize via `{% seo %}`.
  The Substack copies stay live and also self-claim (Substack can't emit
  cross-domain canonicals). This is intentional — do not "fix" it with
  noindex or by deleting either copy.

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

**EXCEPTION: perspectives posts** (`_perspectives/*.md`) keep the exact
formatting and capitalization of Shep's source Google Doc. Never restyle
article content — see `.claude/skills/publish-perspective/SKILL.md`.

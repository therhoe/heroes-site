# therealheroesofecommerce.com

GitHub Pages + Jekyll. Push to `main` = live in ~1 min. No local build needed.

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

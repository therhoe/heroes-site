---
name: publish-perspective
description: Publish a Google Doc as a new "perspectives" article on therealheroesofecommerce.com. Use when Shep shares a Google Docs link to publish, says "publish [doc name]", or wants a Google Doc turned into a page on the site.
---

# Publish a perspective

Convert a Google Doc into a Jekyll perspective page and push it live. The site is this repo, deployed by GitHub Pages on push to `main` (Jekyll builds automatically — there is no local build).

## Getting the doc (preferred: pasted link)

Shep's preferred flow is pasting the doc's URL. The doc must be link-shared ("anyone with the link can view").

1. Extract the file ID from the URL (`docs.google.com/document/d/<FILE_ID>/...`).
2. Download the full doc with images: `https://docs.google.com/document/d/<FILE_ID>/export?format=docx` (plain `Invoke-WebRequest`/`curl` works — no auth needed for link-shared docs). If it fails with 401/403, the doc isn't link-shared — ask Shep to set "anyone with the link can view" and retry.
3. The `.docx` is a zip: copy to `.zip`, extract, images are in `word/media/`. For the text and structure (heading levels, image positions), either parse `word/document.xml` or load `https://docs.google.com/document/d/<FILE_ID>/mobilebasic` in the browser tool and read the rendered page.

Fallback (only if the Drive connector has full access — as of 2026-08 it can only see files Claude created, so search does NOT work): find the doc by name via `search_files` and read it directly.

## Converting

1. **Markdown conversion.** Preserve heading hierarchy (doc H2 → `##`, H3/H4 → `##`/`###` as depth suggests), links, lists, bold/italic, blockquotes, and image positions. Keep Shep's voice and wording — publish the text VERBATIM, including typos. Never fix typos, grammar, punctuation, or jokes; Shep wants his writing untouched (his explicit preference, 2026-09). If a typo looks bad, mention it in the summary but do not change it. Multi-line chants/verses need `<br>` line breaks. Literal heading-tag demos in the text should become code blocks, not real headings.
   **Formatting/capitalization comes from the Google Doc, verbatim.** The site-wide lowercase style rule (see repo `CLAUDE.md`) does NOT apply to perspectives article content — posts keep exactly the casing Shep wrote in the doc, including capitalized headings and sentence case.
2. **Front matter.**
   - `title:` from the doc title
   - `date:` today (YYYY-MM-DD)
   - `description:` draft a ≤160-char meta description — confirm it and the slug with Shep before pushing
   - `tags:` 1–3 lowercase topics, reusing existing tags where possible (check other files in `_perspectives/` first — tags become filter chips on `/perspectives/`, so avoid near-duplicates like `ab-testing` vs `testing`)
   - Slug: kebab-case, short and keyword-bearing. File: `_perspectives/<slug>.md` → URL `/perspectives/<slug>/`.
3. **Images** go to `assets/perspectives/<slug>/` with descriptive filenames and meaningful alt text, referenced as `/assets/perspectives/<slug>/<name>.<ext>`.
4. **Sanity checks before publishing:** flag an abruptly-ending draft to Shep instead of silently publishing it; link mentions of Snapshot CRO / Mouse Whisperer to `/snapshot-cro.html`.

## Publishing

1. Commit with a message like `Add perspective: <title>` and push to `main`.
2. Wait ~1 min for the Pages build, then verify in the browser: `https://therealheroesofecommerce.com/perspectives/<slug>/` renders, images load (`document.images` all `complete` with `naturalWidth > 0`), and the article appears at the top of the `/perspectives/` hub list. (The homepage links to the hub but does not list individual articles.)

## Notes

- Articles live in `_perspectives/`, layout `_layouts/perspective.html` (applied by default via `_config.yml`).
- The `/perspectives/` hub page (`perspectives.html`) lists all articles automatically with client-side keyword search and tag filters; the homepage links to the hub. All of it is Liquid-driven — never hand-edit those lists.
- To edit a published article: edit its `.md` and push. To unpublish: delete the file and push.
- Newsletter-shaped content does NOT belong in perspectives. The site has a separate newsletter archive: `_newsletter/<slug>.html` → `/newsletter/<slug>/`, layout `newsletter`, front matter `title`/`description`/`date`/`substack_url`. Perspectives stay original/evergreen; if a doc reads like a newsletter issue, suggest the archive instead.
- Link mentions of Snapshot CRO to `/snapshot-cro.html`. The Shopify App Store URL is `https://apps.shopify.com/snapshot-cro` (the old `/mousewhisperer` handle is dead).

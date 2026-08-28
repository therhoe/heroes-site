---
name: publish-perspective
description: Publish a Google Doc as a new "perspectives" article on therealheroesofecommerce.com. Use when Shep says "publish [doc name]", "publish my new article", or wants a Google Doc turned into a page on the site.
---

# Publish a perspective

Convert a Google Doc into a Jekyll perspective page and push it live. The site is this repo, deployed by GitHub Pages on push to `main` (Jekyll builds automatically — there is no local build).

## Steps

1. **Find the doc.** Use the Google Drive connector (`search_files` / `list_recent_files`, then `read_file_content` or `download_file_content`) to locate the doc by the name Shep gave. If multiple docs match, list them and ask which one.

2. **Convert to Markdown.** Clean conversion, preserving headings (doc H1/H2 → `##`, H3 → `###`), links, lists, bold/italic, and blockquotes. Keep Shep's voice and wording — fix only unambiguous typos, and mention any fixes made. Site style is lowercase-leaning; do not force it onto the article body.

3. **Front matter.** Create:
   - `title:` from the doc title (or first heading)
   - `date:` today (YYYY-MM-DD)
   - `description:` draft a ≤160-character meta description from the content — show it to Shep for confirmation before publishing, along with the slug
   - Slug: kebab-case from the title, short and keyword-bearing (e.g. `ab-test-sample-pollution`). File goes to `_perspectives/<slug>.md`. URL will be `/perspectives/<slug>/`.

4. **Images.** If the doc has images, export them to `assets/perspectives/<slug>/` and reference as `/assets/perspectives/<slug>/<name>.png` with meaningful alt text. If image export isn't possible via the connector, ask Shep to save them into that folder and reference them anyway.

5. **Publish.** Commit the new file(s) with a message like `Add perspective: <title>` and push to `main`.

6. **Verify.** Wait for the Pages build (~1 min; check with `gh api repos/{owner}/{repo}/pages/builds/latest`), then confirm in the browser that `https://therealheroesofecommerce.com/perspectives/<slug>/` renders and the article appears in the homepage "perspectives" list.

## Notes

- Articles live in `_perspectives/`, layout is `_layouts/perspective.html` (applied by default via `_config.yml` — no `layout:` needed in front matter).
- Homepage listing is automatic (Liquid loop in `index.html`), newest first by `date`. Never hand-edit the homepage list.
- To edit a published article: edit its `.md` file and push. To unpublish: delete the file and push.
- Don't mirror Substack posts here (duplicate content hurts SEO) — perspectives should be original/evergreen pieces.

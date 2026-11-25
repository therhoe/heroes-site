# therealheroesofecommerce.com

GitHub Pages + Jekyll. Push to `main` = live in ~1 min. No local build needed.
Always `git pull` before starting — Shep edits and commits from his own machine.

Marketing site for a boutique CRO agency (Shep + one other person), built
around the Snapshot CRO Shopify app.

**Pause mode ended (2026-10)**: the Substack redirect stub and
`preview-home.html` are gone. `index.html` IS the live homepage —
make homepage changes there.

**The homepage was a one-pager from 2026-10-26 to 2026-11-25**: Shep's
letter and three off-site links, deliberately linking to nothing else
on this site, with the newsletter archive orphaned as the accepted
cost. **That ended 2026-11-25** (Shep's call) when a shared footer went
on every page — Home · Work with me · Newsletter · Privacy Policy. The
archive is reachable from the front door again. The letter itself is
untouched; it is the footer that links out, not the copy.

**The site was cut down hard on 2026-11-25** (Shep's call). Deleted,
with their assets: `hire-cro-agency.html`, `snapshot/` entire (both the
landing page and `grid.html`), `snapshot-insights.html`, `demo/` (10
pages) and `learn/` (4). That took the site from 210 live URLs to 192.
All of it is in git; none of it was the only copy. `/snapshot/` is
being redone later — don't rebuild it from history without asking.

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

- `index.html` — homepage, rebuilt 2026-10-26 as a one-pager on the shape
  of idiosync.site's index: a drawing at ~36% of the measure, the
  headline "CRO is a test" with the yellow highlight, Shep's letter at a
  64ch measure, and three plain text links (Substack, the App Store
  listing, LinkedIn). It replaced the wide two-column hero and the
  three-card grid wholesale — that version is in git at `2b182c7~1`. It
  is **set in Bryndan Write, not Space Grotesk** — see Style. No cards,
  no feature list: anything added here has to beat "nothing".
  The header pill was black and round until 2026-11-25; it is now the
  site's amber 8px control like every other page's.
- `cro-strategy.html` → `/cro-strategy/` — the CRO service page, built
  2026-11-24/25 from a redesign a friend made in Claude, which Shep
  preferred to his own. It is **the page the site's styling comes
  from** — see Style. Hero with a bio card, a client logo marquee, a
  four-step timeline, the PACE cards, a Data Analytics section
  (Snapshot / GA4 / Clarity) with a Loom walkthrough, and a $150
  booking card. All three CTAs point at
  `https://cal.com/jason-shepherd-fblx2v/snapshot-cro`; change one,
  change all three. **`/snapshot/` on the standalone site still
  advertises the same session at $90** — the two prices have not been
  reconciled.
  Its header wears the SNAPSHOT wordmark, not the site's, at its own
  190px sizing: that mark is 3.4:1 against `logo.png`'s 4.4:1, so the
  240px used elsewhere stands 70px tall and bursts the bar.
- `newsletter.html` → `/newsletter/` — newsletter hub (latest issues +
  year-grouped archive, 125 issues). Moved onto `site.css` 2026-11-25;
  its canvas came down from 1200 to the shared 1120.
- `snapshot-privacy-policy.html` — the app's privacy policy, and the only
  one there is. Restyled 2026-11-25 onto `site.css`: it had been the
  site's outlier, system sans with its own blue links and greys and no
  header. It keeps a 760px measure (`.wrap` is overridden) because it
  is prose end to end. `privacy-policy.html` is NOT a second policy: it
  is a redirect stub left at the old URL because that address is
  probably registered as the app's privacy link in the Shopify Partner
  Dashboard, where a 404 is a review problem. Delete it once that
  listing is repointed. It keeps the pre-redesign styling on purpose
  (Shep's call) and is the one page that does NOT load `site.css`.
  **Check whether the Partner Dashboard still links `/snapshot/`** —
  that page is a 404 now.

## Assets (root, all transparent PNG, Shep's own art)

- `logo.png` — 1000x225 wordmark. It sets its text on TWO lines beside
  the mascot, so the type is small for the canvas: each line is 81px
  where the earlier one-line mark was 135px. Header sizing is tuned to
  that (240px wide, 54px tall), not to the ratio — swap in a one-line
  mark and it will look oversized.
- `favicon.png` — 64x64 pixel face, the icon on every page. The
  `/snapshot/` pages that kept the app's own icon were deleted
  2026-11-25.
- `assets/logos/` — the seven client marks in `/cro-strategy/`'s
  marquee, sourced from each brand's own site 2026-11-25. They are
  normalised in CSS, not in the files: `grayscale(1)`, with
  `.is-light` adding `invert(1)` for the two light marks and
  `.is-square` sizing the one square badge. Don't use
  `filter: brightness(0)` — it flattens knockout text into the badge.
- `assets/logos/tools/` — `snapshot.png`, `ga4.svg`, `clarity.png` for
  the Data Analytics cards. **`snapshot.png` is load-bearing twice**:
  it is also `/cro-strategy/`'s header wordmark, because the copy it
  used to use (`snapshot/assets/img/logo-black.png`) was deleted with
  that directory.
- `hero-booth-cro.png` — 1000x1000, the booth with a "Conversion rate
  optimization" sign and white panels. This is the homepage drawing.
- `hero-booth.png` — the earlier booth, yellow panels and an "ANALYTICS /
  Help 5¢" sign. Unused since the 2026-10-26 one-pager but kept. Don't
  consolidate the two.
- `heroes-lineup.png` — the old hero band, unused but kept.

Not art, but it lives with it: `assets/fonts/bryndan-write.woff2`, 23KB,
the homepage's typeface. See Style.

## Content collections

- `_newsletter/*.html` → `/newsletter/<slug>/`, layout `newsletter`, hub
  `newsletter.html`. Migrated + future Substack issues. Docs are cleaned
  HTML (not markdown) wrapped in `{% raw %}`; front matter: `title`,
  `description`, `date`, `substack_url`. Content is verbatim — the casing
  rule below does NOT apply.
- `_layouts/newsletter.html` wraps posts in the site shell (header, nav,
  dateline, subscribe CTA, backlink). It moved onto `site.css`
  2026-11-25. **Every edit here lands on all 125 issues at once** — it
  is the most-repeated markup on the site, which is why its two dead
  nav links were the site's most-repeated 404s.
- Perspectives (republished pieces by other writers) was removed entirely
  2026-09-28 (Shep's call) — don't resurrect it from git history. If it
  ever comes back, republishing someone else's piece needs their written
  consent first.
- Migration script: `.claude/scripts/migrate_substack.py` (takes the
  Substack export zip).
- `_includes/site-footer.html` is the footer on every public page: Home ·
  Work with me · Newsletter · Privacy Policy, and nothing else.
  `index.html` and `snapshot-privacy-policy.html` had no front matter
  before 2026-11-25, so Jekyll copied them verbatim and never ran
  Liquid on them; both now carry an empty front matter block so the
  include renders. **Check a page for literal `{{` / `{%` before
  adding front matter to it** — that is what broke the Pages build in
  `ab3aebc`.
- `_includes/subscribe-email.html` is the email-capture form (posts email
  only to the same Apps Script endpoint as the CRO lead form), used on the
  homepage, the newsletter hub, and the newsletter layout.
- SEO stance: migrated newsletter pages self-canonicalize via `{% seo %}`.
  The Substack copies stay live and also self-claim (Substack can't emit
  cross-domain canonicals). This is intentional — do not "fix" it with
  noindex or by deleting either copy.

## Workshop data decisions

- **Back online 2026-10-20** at the attending team's request: the
  `- workshop` exclude added 2026-10-09 is gone, so `/workshop/*` is
  published again. No live page links to it — the Office Hours repoint
  stands and the deck is reachable by URL only. Don't re-exclude it
  without asking.

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
  plus those tasks, starting from the round-1 order. Both prioritize
  pages share er-prioritize.js. er-conclusion.html closes the deck.
  v2 is the live session: the workshop contents page links only er.html
  (2026-09-29); v1 pages still exist but are unlisted. Don't consolidate
  them; follow the same pattern for future sessions (script template:
  `.claude/scripts/analytics-workshop-apps-script.gs`).
- Slide order per session lives in the deck table at the top of
  `workshop/workshop.js` — add new pages there, not just as links.
- The contents page is `workshop/index.html` (`/workshop/`).
  `workshop/contents.html` is a noindex redirect stub to it.

## Style

**TWO looks now, not four** (Shep's call, 2026-11-25). The public site
is one system; the workshop decks are the other. The `/snapshot/` look
and the separate "marketing pages" look went with the pages that wore
them.

**`assets/css/site.css` is the system, and `/cro-strategy/` is where it
came from** — Shep picked that page's styling and it was lifted out so
every page draws from one file instead of four drifting copies. It
owns the tokens, base type, `.wrap`, the header bar, nav, buttons, the
card primitive, `.eyebrow` and the footer. A page's own `<style>` block
keeps only what that page alone needs.

- **Link `site.css` BEFORE the page's `<style>`** so the page can still
  override. Every page does.
- Corners are **8px** everywhere. Every 999px pill on the site was
  squared 2026-11-25 — don't reintroduce one.
- Cards are `--card-radius` + `--card-shadow`. The old
  `--radius`/`--shadow` names are gone.
- `--accent` (#ffc42a) **cannot carry text on white**. It is only ever
  a fill or a highlight, with dark text on it.
- `.btn--primary` / `.btn--ghost` must stay AFTER `.btn` in source
  order — same specificity, and they were once above it, which made
  both hero buttons black.
- `_includes/site-footer.html` is the footer on every page. Markup
  only: styling lives in `site.css`. Four links, no others.
- Normal capitalization throughout, including nav items and buttons —
  Shep's call, 2026-10-05. Don't lowercase them.
- `newsletter.html` and the newsletter layout keep a **sticky** header.
  That is behaviour their year headers need, not a style difference.

**The homepage is the one carve-out.** It takes all of `site.css` —
8px corners, the amber pill, the shared footer, the 1120 canvas — but
re-points `--font` at **Bryndan Write**, self-hosted at
`assets/fonts/bryndan-write.woff2`, copied from the idiosync repo.
Things that follow from the face, and that will bite anyone editing it:

- **It ships ONE weight.** `font-synthesis-weight: none` is on the body,
  so a bold request degrades to regular rather than being faked. The h1
  is 400 and nothing is above 500. Hierarchy is carried by scale.
- It has no italic either, so `<em>` is a browser-synthesized slant.
- **It is not the raw FontSpace TTF.** That one has no curly quotes, no
  em dash and no ellipsis, all of which are in Shep's letter. The file
  here is the patched + Latin-1-subset build; the only way to regenerate
  it is `.claude/scripts/build-bryndan-woff2.py` in the idiosync repo.
- It is wider than Space Grotesk, so display sizes come down and
  measures go up relative to the other pages.
- `font-synthesis-weight: none` has to stay in the page's own block —
  `site.css` does not set it, because every other page is set in a face
  that has a real bold.
- **The licence is unresolved and that was a decision.** The FontSpace
  page says "Freeware" and nothing more, a commercial-use question there
  went unanswered for six years, and the embedded copyright is
  FontForge's default placeholder. Shep shipped it on idiosync
  2026-10-13 and brought it here knowingly. Don't quietly re-open it; if
  a claim ever arrives the swap is one `@font-face` and one `--font`
  line, and Shantell Sans (Google Fonts, OFL) is the closest match.

**Workshop pages** (`workshop/*`) — the rendered-markdown/terminal
document look (IBM Plex Mono/Sans, `workshop/style.css`). They do NOT
load `site.css` and were deliberately left out of the 2026-11-25
unification (Shep's call, asked and answered). The casing rules there:

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

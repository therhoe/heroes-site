# therealheroesofecommerce.com

GitHub Pages + Jekyll. Push to `main` = live in ~1 min. No local build needed.
Always `git pull` before starting — Shep edits and commits from his own machine.

Marketing site for a boutique CRO agency (Shep + one other person), built
around the Snapshot CRO Shopify app.

**Pause mode ended (2026-10)**: the Substack redirect stub and
`preview-home.html` are gone. `index.html` IS the live homepage —
make homepage changes there.

**The site is a one-pager as of 2026-10-26** (Shep's call). The homepage
is Shep's letter and three off-site links, and it links to nothing else
on this site. Every other page is still published and still cross-links
to its siblings — they are just not reachable from the front door any
more. That includes `/newsletter/` and its ~100 archived issues, which
this site is the canonical home for; orphaning them from the homepage
was the accepted cost, not an oversight. If the archive's traffic
matters later, the cheapest fix is pointing the first ask at
`/newsletter/` instead of Substack.

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
  listing, LinkedIn). One black pill in the header is the page's whole
  allowance for raising its voice. It replaced the wide two-column hero
  and the three-card grid wholesale — that version is in git at
  `2b182c7~1`. It is **set in Bryndan Write, not Space Grotesk** — see
  Style. No cards, no feature list: anything added here has to beat
  "nothing".
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

Two distinct looks. Don't mix them.

**Marketing pages** (`snapshot/`, `hire-cro-agency.html`,
`snapshot-insights.html`, `newsletter.html`, the newsletter layout) —
redesigned 2026-10 as a real site: Space Grotesk, wide canvas, cards,
pill buttons. Normal capitalization throughout, including nav items and
buttons ("Snapshot CRO", "Newsletter", "Work with us", "Install on
Shopify") — Shep's call, 2026-10-05. Don't lowercase them.

**The homepage is its own third look** as of 2026-10-26. It keeps the
marketing tokens — the #14171a ink, the #ffc42a highlight, normal
capitalization — but it is set in **Bryndan Write**, self-hosted at
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
- **The licence is unresolved and that was a decision.** The FontSpace
  page says "Freeware" and nothing more, a commercial-use question there
  went unanswered for six years, and the embedded copyright is
  FontForge's default placeholder. Shep shipped it on idiosync
  2026-10-13 and brought it here knowingly. Don't quietly re-open it; if
  a claim ever arrives the swap is one `@font-face` and one `--font`
  line, and Shantell Sans (Google Fonts, OFL) is the closest match.

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

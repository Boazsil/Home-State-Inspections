# Home State Inspections — site handoff

Hi — this is the updated homestateinspects.com site, built on top of the version you
originally put together. Same approach you set up: plain static HTML/CSS/JS, no framework,
no build step, ready for GitHub Pages.

Everything in this folder is the site. Drop it in the repo as-is.

## What changed since your version

**Content**
- Services went from one general inspection to **13**, each its own anchored section on
  `services.html` with a banner photo.
- New **`warranty.html`** covering the six free third-party warranty programs that come with
  every inspection, with the providers' logos and their PDF fliers in `docs/`.
- About page has Boaz's real bio and his Ohio license number (OHI.2026002101).
- Service area list updated; reworded so it doesn't read as a hard boundary.
- Homepage gained a warranty summary section.

**Fixes to things that were already there**
- `logo-transparent.png` was regenerated. The previous cutout had a soft white halo baked
  into it that showed as a faint ghost outline behind the logo, most visible at the large
  homepage size. `tools/remove-bg.ps1` regenerates it from `logo-source.jpeg` if the source
  ever changes.
- The hero badge row on `index.html` was missing a closing `</div>`, which left the hero's
  left column unclosed. Browsers were silently auto-correcting it.
- Accent colour moved from the placeholder gold to the logo's actual blue (`#0050c4`,
  sampled from the logo file) for eyebrows, links, checkmarks and card icons. Gold is now
  reserved strictly for the primary "Schedule an Inspection" action (the hero button and the
  nav CTA) so it reads as "the button that matters" rather than as a leftover accent.
  `--blue-on-dark` (`#8ab4ff`) covers the places on navy where the logo blue is too dark.

**Contact form**
- Now builds a `mailto:` link to boaz@homestateinspects.com on submit, with a plain `mailto`
  form action as the no-JS fallback. No Formspree account needed. If it should instead land
  in an inbox without opening the visitor's mail client, that's the point to swap in a form
  service.

## Please check with Boaz before changing these

- **InterNACHI branding was intentionally removed** from this copy. Please don't add it back
  without asking; Boaz will say when.
- **Warranty figures** on `warranty.html` come from the provider's own documentation.
  Deductibles differ per programme ($0 on the 90-Day, $300 on SewerGard and MoldSafe, $500
  per leak on the roof plan), so please don't simplify them to a single number.

## Before this goes live

The site is in preview mode - search engines are blocked so the github.io preview cannot get
indexed against the real domain. **See `LAUNCH-CHECKLIST.md`** - that block must be removed at
launch or the real site will not appear in Google.

## Known things still open

1. `images/pre-listing.jpg` is marked for replacement — there's a note at the markup in
   `services.html`. Keep the filename when swapping it.
2. Service photos are stock (Unsplash, free for commercial use). `thermal-imaging.jpg` is the
   exception — that one is Boaz's own photo. Real inspection photos should replace the stock
   ones over time.
3. The services page is grouped into six collapsible categories on phones (~21 screens of
   scrolling down to about 8, and the 13-pill jump nav down to a single "Jump to a service"
   row). See the `.svc-group` notes in `style.css` before changing it: the categories are
   `<details open>`, and desktop visibility is decided in CSS rather than by that attribute
   on purpose, so a stale attribute can never blank out the page.
4. Google Business Profile isn't set up. Not a code task, but it's the highest-leverage thing
   for showing up in local search — NAP needs to match this site exactly.

## Local preview

No build step. Either:

```
npx serve .
```

or just open `index.html` directly from an extracted folder — the links are all relative, so
it works from the filesystem.

## Deploying

Same plan as before: push to the repo, enable GitHub Pages, then point homestateinspects.com
at it. `sitemap.xml` and `robots.txt` are both current and include the new warranty page.

`README.md` has the fuller detail on everything above. One note: it's written for Boaz and
refers to a second folder on his machine (the InterNACHI version) that isn't part of this
handoff — ignore those references.

## Adding or moving a service

The six categories on `services.html` are `<details class="svc-group">` wrappers around runs
of adjacent `<section>` elements. To add a service, put its section inside the right wrapper
and bump the `svc-group-count` text in that group's `<summary>` — the count is written out,
not calculated. Two things are easy to get wrong:

- The sections alternate `section-alt` for the striped backgrounds. Inserting one in the
  middle flips every section after it, so re-check the run.
- Category order is DOM order. Groups only work because each category's services are already
  next to each other in the file, so moving a service between categories means moving its
  section too.

## Address fields

The quote form on `contact.html` takes the street address and city as free text, and the
state as a `<select>` offering **Ohio, Indiana and Kentucky only** — the Cincinnati service
area straddles all three, and an open text field invited enquiries from well outside it.
Please don't widen that list without asking Boaz.

Note this only covers the site's own form. Most bookings go through the ISN scheduler at
`goisn.net`, which is separate software configured in Boaz's ISN account — its own address
fields are not controlled from this repo.

## Cache-busting when you change CSS or JS

`style.css` and `script.js` are linked with a `?v=N` query on all seven pages. GitHub Pages
serves them with `Cache-Control: max-age=600`, so without bumping that number a returning
visitor can keep using the old file for ten minutes after a deploy — long enough to look
like the change never shipped. **Bump `N` on every page whenever either file changes:**

```
sed -i 's/style.css?v=3/style.css?v=4/g; s/script.js?v=3/script.js?v=4/g' *.html
```

# Home State Inspections — Website

> New to this repo? Start with **`HANDOFF.md`** — it summarises what the site contains and
> which parts are intentionally the way they are.

Plain static HTML/CSS/JS site for Home State Inspections (Boaz Silverberg), replacing the near-empty homestateinspects.com placeholder. No framework, no build step — matches the same locked decision used on the Warp9 Drones rebuild: zero moving parts, native fit for free GitHub Pages hosting.

## Pages

- `index.html` — Home
- `services.html` — All 13 services
- `warranty.html` — Free third-party warranty programs, claims process, and downloadable fliers
- `service-area.html` — Cities served (draft list, needs Boaz's confirmation)
- `about.html` — About Boaz (has placeholder headshot + bio, needs real content)
- `contact.html` — Contact + "Get a Free Quote" form
- `privacy-policy.html`

## Service page photos

Most of `images/*.jpg` are stock photos (one per service on `services.html`) sourced from Unsplash, free for commercial use under the [Unsplash License](https://unsplash.com/license) — no attribution required, though it's good practice. These are placeholders: swap in real photos of Boaz's own inspections/equipment whenever available, which read as more authentic than stock photography.

`thermal-imaging.jpg` is the exception — it's a real photo Boaz took himself of an actual thermal-imaged breaker panel (with genuine temperature readouts), so no licensing question at all. This is the model for the rest: as real inspection photos come in, they should replace the stock placeholders one by one.

All 13 services now carry a banner photo. Sourcing note: the 5:1 banner crop cuts people in half, so the photos are deliberately buildings, rooftops, interiors, and objects rather than people at work.

`pre-listing.jpg` is **marked for replacement** — a "coming soon" real estate sign is wanted there instead of the current market-ready home. Free stock libraries don't carry a usable photo of one, so this is waiting on a real photo. Keep the filename when swapping; there is a note at the markup too.

`drone-roof.jpg` is kept even though nothing visible references it - the commented-out drone section points at it, so enabling that service needs no new asset.

## Logo

`logo-source.jpeg` is the original file (1535x1024, plain white background). `logo-transparent.png` is the usable asset generated from it — background removed and auto-cropped to content (1308x832), used across the site at 52px tall in the page header and 108px in the homepage hero.

An earlier version of `logo-transparent.png` was cut out with a background-removal tool that left a soft white halo/glow around the shape — visible as a faint "ghost" duplicate behind the crisp logo, especially at larger sizes. It's been regenerated with `tools/remove-bg.ps1`, which flood-fills the white background inward from the image edges (so it can't accidentally punch through enclosed white/light-gray shapes like the second house's wall and roof) and anti-aliases only the true edge pixels. No halo. Re-run it any time `logo-source.jpeg` is replaced:

```
powershell -ExecutionPolicy Bypass -File tools\remove-bg.ps1
```

## Status

All the original open items are filled in:

- **Contact form** — no backend/account needed. It builds a `mailto:` link to `boaz@homestateinspects.com` on submit (with a native `mailto` form action as the no-JS fallback). If Boaz later wants submissions to land in an inbox without opening the visitor's own mail client, swap in a form service (Formspree, etc.) at that point.
- **Boaz's headshot** — real photo (`boaz.jpg`), already wired into `about.html`.
- **Boaz's bio + Ohio license number** — filled in: production/manufacturing leadership background, industrial engineering degree (kept separate from inspection scope so it doesn't read as "we do engineering here"), License #OHI.2026002101.
- **Service area** — kept the suburb list, reworded to make clear it's not a hard boundary; Ohio-licensed only, so scoped to the Ohio side of Greater Cincinnati.
- **Services** — 13 services, each its own anchored section on `services.html`: general (thermal imaging folded in as included, not a separate add-on), limited/investigative, pre-listing, pre-listing consultation, investor 5-point, multifamily up to 4 units, sewer scope, mold, contractor work verification, commercial, limited commercial roof, new construction, and pre-drywall.

  Radon testing, drone roof inspection, and pool &amp; spa are deliberately not offered on this site.
- **Warranty programs** — six free third-party programs from Inspector Services Group, summarised on the homepage (`index.html#warranty`) and covered in full on `warranty.html`: the 90-Day Structural &amp; Mechanical warranty, SewerGard, MoldSafe, the 5-year Platinum Roof Protection Plan, RecallChek appliance recall monitoring, and Full Concierge move-in help.

  RecallChek and Full Concierge were missing from the site entirely until the provider's fliers were reviewed — RecallChek in particular is a strong differentiator (recall monitoring that continues for as long as the client owns the home).

  Partner logos live in `images/warranty/`, and the provider's own PDF fliers are served from `docs/` (~9 MB total) so buyers and referring agents can download them. All figures on the page are taken from those fliers and the provider's coverage email; the page carries a disclaimer making clear these are third-party service contracts, not insurance, and not underwritten by Home State Inspections.
- **Colors** — accent shifted from the placeholder gold toward the logo's actual blue (`#0050c4`, sampled from the logo file) for eyebrows, links, checkmarks, and card icons on white/paper backgrounds. Gold is now reserved strictly for the primary "Schedule an Inspection" action (hero button + nav CTA); every other former gold use (eyebrow, hero emphasis, top-bar and footer link hovers) moved to `--blue-on-dark` (`#8ab4ff`), a lighter blue that holds contrast on navy where the logo blue does not.
- **Header no longer shrinks on scroll.** The homepage header used to drop from a large logo to a compact one once you scrolled past it. It was removed rather than tuned: the header is sticky, so changing its height reflows the whole page below it. With a CSS transition that meant a reflow every frame, which read as flicker; without one it meant the page lurching up ~120px the moment you started scrolling. Both header sizes are now fixed (130px logo on the homepage, 84px elsewhere) and scrolling touches no layout.

## Still worth doing

1. **Drone roof inspection — intentionally disabled.** The FAA Part 107 certificate is shown as a credential (About page paragraph, hero badge on `index.html`), but no drone or aerial service is offered anywhere on the site.

   The service section is written and ready but **commented out** in `services.html` — the full section, its nav pill, and a drone bullet in the Limited Commercial Roof checklist. `images/drone-roof.jpg` is already in place. Grep for `DISABLED` to find all three, and follow the instructions in the block comment. Verified inert: the section does not reach the DOM and no drone text is visible to visitors. Check with Boaz before enabling.
2. **InterNACHI** — intentionally removed. Check with Boaz before adding it back.
3. **Reviews/testimonials** — a testimonials section can be added once there are reviews to show.
4. **Google Business Profile** — not part of this repo, but the highest-leverage thing to set up next: it's what actually shows up in the Google Maps "local pack" for searches like "home inspector Blue Ash." NAP (name/address/phone) must match this site exactly.

## Local preview

No build step — just serve the folder statically, e.g.:

```
npx serve .
```

## Hosting plan (once reviewed)

Same cutover pattern as Warp9: push to a new GitHub repo (separate account/repo from Warp9, per Shmulik), enable GitHub Pages, then later point the real homestateinspects.com domain at it and retire whatever the domain currently points to.

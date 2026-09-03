# Launch checklist

Target: serve this site at **https://homestateinspects.com** from Namecheap cPanel hosting.

Work through these in order. Step 4 in particular must not be done early.

---

## Before you start: two records you must not touch

DNS for this domain is managed at **Namecheap** (nameservers `dns1`/`dns2.registrar-servers.com`).
Two existing records have nothing to do with the website and will break things if removed:

| Record | Value | What it does |
|---|---|---|
| `MX` | `smtp.google.com` | Routes **boaz@homestateinspects.com**. Delete it and email stops arriving. |
| `TXT` | `google-site-verification=dMowLD…` | Proves domain ownership to Google. |

Only the **A record** (and the `www` record) should change.

---

## 1. Upload the site to `public_html`

In cPanel → **File Manager** → `public_html`, upload everything in this folder **except**
the files listed below. Simplest route is to zip the site locally, upload the zip, and use
cPanel's **Extract**.

**Do not upload these** — they are notes and tooling, not the website:

```
README.md
HANDOFF.md
LAUNCH-CHECKLIST.md
.gitignore
logo-source.jpeg
tools/
```

`README.md` and `HANDOFF.md` record that the service photos are stock, that the InterNACHI
membership is not active, and that the Google Business Profile is not set up. At
`homestateinspects.com/HANDOFF.md` anyone could read that. `.htaccess` blocks these as a
backstop, but the real fix is not uploading them.

**Do upload `.htaccess`.** File Manager hides dotfiles by default — turn on
**Settings → Show Hidden Files** first, or it gets silently skipped and you lose HTTPS
redirection, the cache headers, and the block above.

`public_html` should end up as:

```
public_html/
  .htaccess
  404.html
  about.html   contact.html   index.html   privacy-policy.html
  service-area.html   services.html   warranty.html
  style.css   script.js
  robots.txt   sitemap.xml
  boaz.jpg   logo-transparent.png
  images/     images/warranty/
  docs/
```

## 2. Point the domain at the hosting

Get the server's IP from cPanel — right-hand sidebar, **Shared IP Address**.

Then Namecheap → **Domain List → Manage → Advanced DNS**:

| Type | Host | Value |
|---|---|---|
| A Record | `@` | *(the cPanel Shared IP)* |
| CNAME | `www` | `homestateinspects.com.` |

Remove the existing A record pointing at the old placeholder page. **Leave MX and TXT alone.**

DNS takes minutes to a couple of hours. Check with `nslookup homestateinspects.com` — when it
returns the cPanel IP, it has propagated.

## 3. Turn on HTTPS

cPanel → **SSL/TLS Status** → select the domain → **Run AutoSSL**, which issues a free
Let's Encrypt certificate. Wait until it reports the domain secured before step 4: `.htaccess`
forces every request to HTTPS, so the site shows certificate warnings until it exists.

Confirm `https://homestateinspects.com` loads with a padlock and that
`http://www.homestateinspects.com` redirects to the secure bare domain.

## 4. Remove the search-engine block — **only after steps 1–3 are done**

The site has been hidden from Google so the GitHub preview could not compete with the real
domain. Doing this early gets the preview indexed; never doing it means the real site never
appears in Google at all.

**`robots.txt`** — replace the whole file with:

```
User-agent: *
Allow: /

Sitemap: https://homestateinspects.com/sitemap.xml
```

**These six pages** — delete the `noindex` line and the comment above it from `index.html`,
`services.html`, `warranty.html`, `service-area.html`, `about.html`, `contact.html`:

```html
<meta name="robots" content="noindex, nofollow">
```

**Leave `privacy-policy.html` and `404.html` alone.** Their `noindex` is permanent and
intentional — neither belongs in search results.

Check with:

```
grep -rn "noindex" *.html robots.txt
```

When that returns only `privacy-policy.html` and `404.html`, this step is done. Re-upload the
changed files.

## 5. Check it actually works

- Every page loads over HTTPS, with styling and images.
- The mobile menu opens; the services page categories expand.
- **The quote form on `contact.html`** — see the warning below.
- `homestateinspects.com/HANDOFF.md` returns **404**, not the file.
- A made-up URL like `homestateinspects.com/nope` shows the styled 404 page.
- Send a test email to `boaz@homestateinspects.com` to confirm DNS did not disturb it.

---

## Decide before launch: the quote form

`contact.html` submits with `action="mailto:"`. It tries to open the visitor's email app with
the details pre-filled. That works on a desktop with a configured mail client and fails
**silently** for anyone on webmail without one — common on phones. They press *Send Quote
Request*, nothing obvious happens, and the enquiry never reaches Boaz.

For a business whose main conversion is *request a quote*, this is the biggest functional gap
at launch. cPanel hosting runs PHP, so a small mail handler would deliver straight to the inbox
with no third-party service; a hosted form (Formspree's free tier covers 50 a month) is the
no-code alternative. Worth resolving before the site draws traffic.

---

## Content decisions still open

- **Drone roof inspection is live** as of 2 September 2026, on Boaz's instruction — a normal
  service section with its own jump-nav pill and a bullet in the Limited Commercial Roof list.
- **InterNACHI** branding is absent from this copy. Boaz previously said the site would not go
  live before the membership was active. Confirm that still holds, or launch without it.
- **`images/pre-listing.jpg`** is a stand-in — a "coming soon" real estate sign is wanted. See
  the note at the markup in `services.html`.
- **No reviews or testimonials yet.** A section can be added once there are some.

## After launch

- **Google Business Profile.** Not a code task, and the highest-leverage thing left: for a
  local inspector it drives more calls than the website does. It is what appears in Google Maps
  for "home inspector Blue Ash". Name, phone (513-237-9552) and address must match this site
  exactly.
- **Google Search Console** — add the property, submit
  `https://homestateinspects.com/sitemap.xml`.
- Retire whatever served the old placeholder page, so it is not still being paid for.

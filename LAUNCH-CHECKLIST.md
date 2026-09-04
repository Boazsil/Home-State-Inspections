# Launch checklist

Goal: make **https://homestateinspects.com** show this site.

Boaz has the domain name at Namecheap but **no hosting there** — the two Namecheap charges
in May 2026 ($6.99 and $11.18) were for the domain. He does not need hosting: the site is
plain HTML with nothing to run on a server, so GitHub Pages serves it for free and will keep
doing so. The only job is pointing the domain at it.

Do these in order. Step 4 must not be done early.

---

## Before you start: two records you must not touch

DNS is managed at **Namecheap** (nameservers `dns1`/`dns2.registrar-servers.com`). Two
existing records have nothing to do with the website and will break things if removed:

| Record | Value | What it does |
|---|---|---|
| `MX` | `smtp.google.com` | Delivers **boaz@homestateinspects.com**. Remove it and email stops arriving. |
| `TXT` | `google-site-verification=dMowLD…` | Proves to Google that Boaz owns the domain. |

Only the **A records** and the **www** record should change.

---

## 1. Tell GitHub which domain to answer for

Create a file named `CNAME` (no extension) in the root of the repo containing exactly:

```
homestateinspects.com
```

Then in the repo on GitHub: **Settings → Pages → Custom domain**, enter
`homestateinspects.com`, and Save. GitHub adds the same `CNAME` file if you do it through
the settings page, so either route works — just don't delete the file afterwards, or the
custom domain switches off.

## 2. Point the domain at GitHub

Namecheap → **Domain List → Manage → Advanced DNS**.

Delete the existing A record (the one sending the domain to the current placeholder page),
then add these five:

| Type | Host | Value |
|---|---|---|
| A Record | `@` | `185.199.108.153` |
| A Record | `@` | `185.199.109.153` |
| A Record | `@` | `185.199.110.153` |
| A Record | `@` | `185.199.111.153` |
| CNAME | `www` | `boazsil.github.io.` |

Four A records is correct — they are GitHub's four servers, and listing all four means the
site stays up if one is unavailable. **Leave the MX and TXT records alone.**

Changes take anywhere from a few minutes to a couple of hours. Check with
`nslookup homestateinspects.com` — when it returns one of the four addresses above, it has
gone through.

## 3. Turn on HTTPS

Back in **Settings → Pages**, wait for the DNS check to pass, then tick **Enforce HTTPS**.
The tickbox stays greyed out until GitHub has issued the certificate, which can take up to
an hour after DNS resolves. Nothing to buy — it is free and renews itself.

Confirm `https://homestateinspects.com` loads with a padlock.

## 4. Remove the search-engine block — **only after steps 1–3 are done**

The site has been hidden from Google so the preview could not compete with the real domain
in search results. Doing this early gets the preview indexed instead; never doing it means
the real site never appears in Google at all.

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

**Leave `privacy-policy.html`, `404.html` and `thank-you.html` alone.** Their `noindex` is
permanent and intentional — none of them belongs in search results.

Check with:

```
grep -rn "noindex" *.html robots.txt
```

When that returns only those three pages, the step is done.

## 5. Check it works

- Every page loads over HTTPS, with styling and images.
- The mobile menu opens; the services page categories expand.
- **Send a real test through the quote form** — see below, there is a one-time step.
- A made-up address like `homestateinspects.com/nope` shows the site's own 404 page.
- Send yourself an email at `boaz@homestateinspects.com` to confirm DNS did not disturb it.

---

## The quote form

Fixed 3 September 2026. It posts to FormSubmit, which forwards each entry to
boaz@homestateinspects.com. It previously used `action="mailto:"`, which sent nothing — it
only opened a draft in the visitor's own email app and left them to press send. That failed
silently for anyone without a mail app set up, and those enquiries were lost with no trace.

**One-time step, do not skip:** the first time the form is submitted, FormSubmit emails Boaz
a confirmation link. Until he clicks it, entries are held rather than delivered. Send a test
entry immediately after launch and click that link.

After sending, visitors land on `thank-you.html`. The form's `_next` field points at
`https://homestateinspects.com/thank-you.html`, so that redirect only resolves once the
domain is live.

## A note on `.htaccess`

The repo contains an `.htaccess` file. **GitHub Pages ignores it entirely** — it only does
anything on ordinary Apache hosting such as a cPanel plan. It is kept because it is written
and correct, and it would take effect immediately if the site ever moves to that kind of
host. On GitHub Pages, the HTTPS redirect it describes is handled by *Enforce HTTPS* instead.

One consequence of GitHub Pages: it caches pages for ten minutes and gives no way to change
that. After an update, a returning visitor can see the old version for up to ten minutes.
For a site that rarely changes this does not matter; it is only annoying while actively
editing.

---

## Content decisions still open

- **Drone roof inspection is live** as of 2 September 2026, on Boaz's instruction.
- **InterNACHI branding stays off** — confirmed 3 September 2026. Do not add it back until
  Boaz says the membership is active, and then use the real member number.
- **`images/pre-listing.jpg`** is a stand-in — a "coming soon" real estate sign is wanted.
  See the note at the markup in `services.html`.
- **No reviews or testimonials yet.** A section can be added once there are some.

## After launch

- **Google Business Profile.** Not a code task, and the highest-leverage thing left: for a
  local inspector it brings in more calls than the website does. It is what shows up in
  Google Maps for "home inspector Blue Ash". The business name, phone (513-237-9552) and
  address must match this site exactly.
- **Google Search Console** — add the property and submit
  `https://homestateinspects.com/sitemap.xml`.
- Cancel whatever was serving the old placeholder page, if it costs anything.

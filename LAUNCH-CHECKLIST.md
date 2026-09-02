# Launch checklist

The site is currently in **preview mode**. It is deliberately hidden from Google so the
`boazsil.github.io` preview cannot get indexed and compete with the real
`homestateinspects.com` in search results.

**These two things must be undone at launch, or the real site will not appear in Google.**

---

## 1. Remove the search-engine block

**`robots.txt`** — replace the whole file with:

```
User-agent: *
Allow: /

Sitemap: https://homestateinspects.com/sitemap.xml
```

**All six pages** — delete this line, and the comment above it, from `index.html`,
`services.html`, `warranty.html`, `service-area.html`, `about.html`, `contact.html`:

```html
<meta name="robots" content="noindex, nofollow">
```

Leave `privacy-policy.html` alone — its `noindex` is intentional and permanent.

To find them all:

```
grep -rn "noindex" *.html robots.txt
```

When that returns only `privacy-policy.html`, this step is done.

---

## 2. Confirm the content decisions still hold

- **Drone roof inspection is live again** as of 2 September 2026, on Boaz's instruction. It is
  now a normal service section on `services.html`, with its own jump-nav pill and a bullet in
  the Limited Commercial Roof list.
- **InterNACHI** branding is absent. Only add it once the membership is active, and use the
  real member number.
- **`images/pre-listing.jpg`** is marked for replacement — see the note at the markup.

---

## 3. After the domain is pointed at the site

- Submit `https://homestateinspects.com/sitemap.xml` in Google Search Console.
- Set up the Google Business Profile if it isn't done. For a local business this drives more
  enquiries than the website itself — it is what appears in the Google Maps results for
  searches like "home inspector Blue Ash." The name, address, and phone must match this site
  exactly.
- Check the contact form: it opens the visitor's email client. If that turns out to lose
  enquiries, swap in a hosted form service.

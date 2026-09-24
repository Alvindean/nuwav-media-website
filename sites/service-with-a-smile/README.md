# Service With A Smile: Linda D. Ray

A one-page site built from Linda's business card. It's plain HTML with no build step.

- `index.html`: the whole site (Google Fonts are the only external request)
- `linda-ray.jpg`: portrait cropped from the card

To deploy, upload this folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages).
The quote form opens the visitor's email app, addressed to Lray@att.net. To receive form submissions without email, swap it for Formspree or Netlify Forms.

## Cloudflare Workers

`wrangler.jsonc` makes this folder a static-assets Worker named `service-with-a-smile`. In the Worker's build settings, set **Root directory** to `sites/service-with-a-smile`, leave the build command empty, and use `npx wrangler deploy` as the deploy command. `.assetsignore` stops the config and README from being published.

## Local SEO pages (generator)

`generator/` builds the service, state, city and service-in-city pages from JSON content. It is plain Node with no dependencies, and it isn't published (it's listed in `.assetsignore`).

```
node generator/build.mjs            # build live pages into this folder
node generator/build.mjs --preview  # also build drafts into generator/.preview (noindex)
```

- `generator/site.config.json`: business inputs (name, phone, primary service, state, site URL)
- `generator/content/services.json`: the primary service's authority page and the secondary services
- `generator/content/states/*.json`: state hub content
- `generator/content/cities/*.json`: one file per city. Only `"status": "live"` cities are published.
- `generator/content/service-pages/*.json`: `/{service}-in-{city}-{st}/` pages

URLs: `/event-cleanup/`, `/event-cleanup/california/`, `/event-cleanup/california/{city}/`, `/{service}-in-{city}-ca/`.

**Adding a city:** copy a city file, write real local content, set `"status": "live"`, and run the build. The build refuses to publish thin pages (below a minimum word count), pages missing FAQs, bad title or description lengths, and city pages that overlap more than 25% with another city page. It also rewrites `sitemap.xml` and `robots.txt`, and adds LocalBusiness, Service, BreadcrumbList and FAQPage schema to every page.

Commit the generated pages after building. Cloudflare serves this folder as-is.

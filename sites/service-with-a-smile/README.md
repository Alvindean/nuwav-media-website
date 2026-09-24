# Service With A Smile: Linda D. Ray

A one-page site built from Linda's business card. It's plain HTML with no build step.

- `index.html`: the whole site (Google Fonts are the only external request)
- `linda-ray.jpg`: portrait cropped from the card

To deploy, upload this folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages).
The quote form opens the visitor's email app, addressed to Lray@att.net. To receive form submissions without email, swap it for Formspree or Netlify Forms.

## Cloudflare Workers

`wrangler.jsonc` makes this folder a static-assets Worker named `service-with-a-smile`. In the Worker's build settings, set **Root directory** to `sites/service-with-a-smile`, leave the build command empty, and use `npx wrangler deploy` as the deploy command. `.assetsignore` stops the config and README from being published.

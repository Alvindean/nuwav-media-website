# Sell-your-data funnel → Google Sheet

The funnel at `/sell-your-data` posts each submission to a Google Apps Script
web app, which writes it into the **Replay Referrals** sheet:

- **Deals** tab: fills columns A–G (Company Name, Contact Name, Contact Email,
  Industry, Peak FTE, Operating History, Data Sources). Status (H) and every
  column after it are left for Replay, as the sheet's Instructions tab asks.
- **Funnel Responses** tab (created automatically): all 10 answers, plus
  timestamp, UTM tags, `?ref=` value, referrer and page URL.

## One-time setup (about 5 minutes)

1. Open the sheet → **Extensions → Apps Script**.
2. Delete what's in `Code.gs` and paste in `sell-data-funnel.gs` from this folder. Save.
3. **Deploy → New deployment** → type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, approve the permissions, and copy the **Web app URL**
   (ends in `/exec`). Open it in a browser — it should say `ok`.
5. In Cloudflare Pages → the NuWav project → **Settings → Environment variables**, add
   `NEXT_PUBLIC_SHEETS_WEBHOOK_URL` = that URL, then redeploy.
   For local testing, put the same line in `.env.local`.

If you later edit the script, use **Deploy → Manage deployments → Edit → New
version** so the URL stays the same.

## Tracking referrers

Add `?ref=name` (and any `utm_` tags) to the link you share, e.g.
`https://nuwavmedia.com/sell-your-data/?ref=jackie&utm_source=linkedin`.
They land in the Funnel Responses tab.

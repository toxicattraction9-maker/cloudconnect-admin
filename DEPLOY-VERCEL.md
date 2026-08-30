# Deploy YonoAppsCenter to Vercel

The backend (database, auth, admin roles) stays on Lovable Cloud. Vercel only
hosts the website.

## Steps

1. Push this project to GitHub (Lovable → GitHub → Connect).
2. In Vercel: **Add New → Project → Import** that repository.
3. Leave every setting as detected — `vercel.json` already sets the build:
   - Install: `bun install`
   - Build: `NITRO_PRESET=vercel bun run build`
   - Output: `.vercel/output`
4. Click **Deploy**.

## No keys to paste

The backend URL and the public (publishable) key are committed in `.env`, so
Vercel picks them up during the build. Nothing has to be entered in the Vercel
dashboard. Only public keys are stored there — the secret service key stays on
Lovable Cloud and is never shipped to the browser.

## Editing content after deployment

Sign in at `/auth` with the admin username and manage apps at `/admin`.
Content is stored in Lovable Cloud, so edits appear instantly on the Vercel
site without a redeploy.

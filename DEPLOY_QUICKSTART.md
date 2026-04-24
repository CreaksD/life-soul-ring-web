# Deploy Quickstart

This project supports two fast deployment paths.

## Option 1: Push to GitHub

When the Vercel project is connected to the GitHub repository, every push to the production branch will trigger a new deployment automatically.

```bash
git add .
git commit -m "your update"
git push origin main
```

After the push finishes, Vercel starts the build automatically.

This repository is configured to use the local GitHub credential helper script in `scripts/git-credential-github.ps1`, which reads the `GITHUB_TOKEN` user environment variable.

## Option 2: Deploy directly with Vercel CLI

Use this when you want to ship immediately from the current machine.

```bash
npx vercel --prod
```

This project already includes `.vercelignore`, so local artifacts like `.next.zip` and `node_modules.zip` will not be uploaded.

## Option 3: Deploy to a Linux server

For Ubuntu or other Linux servers, build a standalone package locally:

```powershell
.\scripts\package-standalone.ps1
```

This generates:

- `.deploy/life-soul-ring-web-standalone.tar.gz`
- `deploy/linux/life-soul-ring-web.service`
- `deploy/linux/life-soul-ring-web.nginx.conf`

Recommended runtime shape:

- Ubuntu 24.04
- Node.js 20 LTS or newer
- systemd for process management
- Nginx as reverse proxy

## Current production URL

- `https://life-soul-ring-web.vercel.app`
- `https://soul.lucasisme.top`

## Notes

- If Git auto deploy is connected, `git push` is the fastest normal workflow.
- If you want to bypass Git and deploy local changes directly, use `npx vercel --prod`.
- Keep large local archives out of Git and Vercel uploads.
- For the China-facing server, keep `soul.lucasisme.top` on `DNS only` in Cloudflare and use Certbot on the server for free HTTPS with auto-renewal.

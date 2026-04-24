# Deploy Quickstart

This project supports two fast deployment paths.

## Option 1: Push to GitHub

When the Vercel project is connected to the GitHub repository, every push to the production branch will trigger a new deployment automatically.

```bash
git add .
git commit -m "your update"
git push origin master
```

After the push finishes, Vercel starts the build automatically.

## Option 2: Deploy directly with Vercel CLI

Use this when you want to ship immediately from the current machine.

```bash
npx vercel --prod
```

This project already includes `.vercelignore`, so local artifacts like `.next.zip` and `node_modules.zip` will not be uploaded.

## Current production URL

- `https://life-soul-ring-web.vercel.app`

## Notes

- If Git auto deploy is connected, `git push` is the fastest normal workflow.
- If you want to bypass Git and deploy local changes directly, use `npx vercel --prod`.
- Keep large local archives out of Git and Vercel uploads.

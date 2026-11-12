# Sethu Madhavan V G — Portfolio

Personal portfolio built with **Angular 22** (standalone components, signals, zoneless change detection),
hosted on **Azure Static Web Apps**.

## Run locally

```bash
npm install
npm start          # http://localhost:4200
npm test -- --watch=false
npm run build      # output: dist/portfolio/browser
```

## Edit the content

Everything shown on the page — profile, projects, stack keys, experience — lives in
[`src/app/data/portfolio.ts`](src/app/data/portfolio.ts). Change it there; the components just render it.

| Path | What it is |
| --- | --- |
| `src/app/sections/` | One component per page section (header, hero, about, projects, stack, experience, contact) |
| `src/app/shared/` | Project illustrations, toast, pointer effects (pixel trail, cursor label, project peek) |
| `src/app/core/` | Shared state: project filter/open state, terminal commands, toast |
| `src/styles.css` | Global design tokens and styles |
| `src/index.html` | SEO meta tags and JSON-LD |
| `public/staticwebapp.config.json` | Azure SWA routing fallback, caching and security headers |

## Deploy to Azure Static Web Apps

1. Push this folder to a GitHub repository (branch `main`).
2. In the Azure portal: **Create a resource → Static Web App**. Pick the Free plan, then under
   *Deployment details* choose **Other** (this repo already contains its own workflow).
3. Open the new Static Web App → **Manage deployment token** → copy the token.
4. In GitHub: **Settings → Secrets and variables → Actions → New repository secret**, name it
   `AZURE_STATIC_WEB_APPS_API_TOKEN`, paste the token.
5. Push to `main`. `.github/workflows/azure-static-web-apps.yml` installs, tests, builds and uploads
   `dist/portfolio/browser`. Pull requests get their own preview URL.
6. After the first deploy, update `<link rel="canonical">` in `src/index.html` to the site's URL
   (or your custom domain, added under **Custom domains** in the portal).

Prefer the CLI? After `npm run build`:

```bash
npx @azure/static-web-apps-cli deploy dist/portfolio/browser --deployment-token <token> --env production
```

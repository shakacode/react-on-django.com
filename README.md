# react-on-django.com

Production site workspace for `react-on-django.com`, built with Docusaurus.

## Architecture

- Canonical markdown source belongs in `react-on-django/docs/`
- This repo syncs docs into `content/upstream/docs`
- A prepare step stages those docs into `prototypes/docusaurus/docs`
- Site-owned pages stay here, such as the landing page, examples page, and Pro page

## Docs Ownership Rules

- Treat `/Users/justin/codex/react-on-django/docs` as the local source of truth when it exists.
- CI and non-local builds should sync from `https://github.com/shakacode/react-on-django`.
- Keep this repo focused on site presentation, navigation, redirects, and docs build transforms.
- Do not commit generated docs trees. They are intentionally gitignored.

## Local Development

1. Install the site dependencies:
   - `npm run install:site`
2. Sync upstream docs and stage the Docusaurus docs tree:
   - `npm run prepare`
3. Run the site locally:
   - `npm run dev`

## Build

- Build from an already prepared docs tree:
  - `npm run build`
- Full build from a fresh sync:
  - `npm run build:full`

## Sync Resolution

`scripts/sync-docs.mjs` resolves upstream docs in this order:

1. `REACT_ON_DJANGO_DOCS`
2. `/Users/justin/codex/react-on-django/docs`
3. Shallow clone of `https://github.com/shakacode/react-on-django.git`

If no upstream `docs/` directory exists yet, the sync step fails with a clear error so the missing source content is explicit.

## Cloudflare Pages

- Project: `react-on-django-com`
- Build output: `prototypes/docusaurus/build`

Required repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Optional repository variable:

- `CLOUDFLARE_PAGES_PROJECT` (defaults to `react-on-django-com`)

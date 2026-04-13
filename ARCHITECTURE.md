# react-on-django.com Architecture

## Decision

Use a dedicated Docusaurus site repo with docs synced from the product repo.

## Framework

Selected framework: **Docusaurus**.

## Content Flow

```text
react-on-django/docs -> content/upstream/docs -> prototypes/docusaurus/docs -> build/deploy
```

1. `npm run sync:docs` copies docs from the local checkout or a shallow GitHub clone
   and can pin the sync to an exact upstream commit SHA
2. `npm run prepare:docs` stages the docs into the Docusaurus workspace
3. Docusaurus builds static output at `prototypes/docusaurus/build`
4. Cloudflare Pages deploys the static output

## Upstream Source

- Local path: `/Users/justin/codex/react-on-django/docs`
- GitHub repo fallback: `shakacode/react-on-django`

## Deployment Target

- Cloudflare Pages project: `react-on-django-com`
- Cloudflare account ID: `fed541b7e7055a428a1b045aa3cd2c89`
- Intended domain: `https://react-on-django.com/`

## Generated Directories

These are derived artifacts and should not be committed:

- `content/upstream/docs/`
- `content/upstream/docs-subset/`
- `content/upstream/sidebars.ts`
- `prototypes/docusaurus/docs/`
- `prototypes/docusaurus/build/`

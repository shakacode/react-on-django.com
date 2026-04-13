# Cloudflare Pages Setup

## Project

- Pages project name: `react-on-django-com`
- Primary domain: `react-on-django.com`
- Cloudflare account ID: `fed541b7e7055a428a1b045aa3cd2c89`

## Required GitHub Secrets

Set these in the `shakacode/react-on-django.com` repository:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Optional repository variable:

- `CLOUDFLARE_PAGES_PROJECT` (defaults to `react-on-django-com`)

Expected values:

- `CLOUDFLARE_ACCOUNT_ID` must be `fed541b7e7055a428a1b045aa3cd2c89`
- `CLOUDFLARE_API_TOKEN` must belong to that same account and have permission to manage the `react-on-django-com` Pages project

## Deploy Flow

The Cloudflare Pages pipeline:

1. checks out the repo
2. syncs docs from the local path or GitHub fallback
3. optionally checks out the exact upstream commit SHA from the dispatch payload
4. prepares the Docusaurus docs tree
5. runs the root `npm run build` flow
6. deploys `prototypes/docusaurus/build` through `wrangler pages deploy`

## Source Trigger

`shakacode/react-on-django` is the canonical docs source. Its
`Trigger docs site rebuild` workflow dispatches this repo after `docs/**`
changes land on `main`.

For manual verification, either:

- run the source-side workflow with `workflow_dispatch`, or
- run this repo's `Site Build and Deploy` workflow manually with `repo_url`,
  `ref`, and optional `sha` inputs

## Manual Domain Step

Attach the custom domain to the Pages project:

1. Workers & Pages -> `react-on-django-com`
2. Custom domains -> `Set up a custom domain`
3. Add:
   - `react-on-django.com`
   - `www.react-on-django.com` (optional)

Cloudflare provisions TLS automatically after the domain is attached.

If the same hostname is already attached to a legacy custom-domain Worker, remove
that Worker-domain attachment first so the Pages project can own the hostname.

## Redirects

Site redirects live in `prototypes/docusaurus/static/_redirects`.

They currently preserve the expected docs namespace and old licensing URLs:

- `/react-on-django/docs/*` -> `/docs/:splat`
- `/react-on-django/docs` -> `/docs`

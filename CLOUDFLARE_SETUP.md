# Cloudflare Workers Builds Setup

## Project

- Worker project name: `react-on-django-com`
- Primary domain: `react-on-django.com`

## Required GitHub Secrets

Set these in the `shakacode/react-on-django.com` repository:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Deploy Flow

The Cloudflare Workers Builds pipeline:

1. checks out the repo
2. syncs docs from the local path or GitHub fallback
3. prepares the Docusaurus docs tree
4. runs the root `npm run build` flow
5. deploys `prototypes/docusaurus/build` through `wrangler deploy`

## Manual Domain Step

Complete the custom-domain attachment in the Cloudflare dashboard:

1. Workers & Pages -> `react-on-django-com`
2. Custom domains -> `Set up a custom domain`
3. Add:
   - `react-on-django.com`
   - `www.react-on-django.com` (optional)

Cloudflare provisions TLS automatically after the domain is attached.

## Redirects

Site redirects live in `prototypes/docusaurus/static/_redirects`.

They currently preserve the expected docs namespace and old licensing URLs:

- `/react-on-django/docs/*` -> `/docs/:splat`
- `/react-on-django/docs` -> `/docs`

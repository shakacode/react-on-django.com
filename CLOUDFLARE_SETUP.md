# Cloudflare Pages Setup

## Project

- Suggested Pages project name: `react-on-django-com`
- Primary domain: `react-on-django.com`

## Required GitHub Secrets

Set these in the `shakacode/react-on-django.com` repository:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Optional repository variable:

- `CLOUDFLARE_PAGES_PROJECT`

If the variable is not set, the workflow defaults to `react-on-django-com`.

## Deploy Flow

The GitHub Actions workflow:

1. checks out the repo
2. syncs docs from the local path or GitHub fallback
3. prepares the Docusaurus docs tree
4. installs site dependencies
5. builds the site
6. deploys `prototypes/docusaurus/build` to Cloudflare Pages

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

They currently preserve the expected docs namespace:

- `/react-on-django/docs/*` -> `/docs/:splat`
- `/react-on-django/docs` -> `/docs`

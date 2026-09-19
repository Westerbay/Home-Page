# Development

## Environment

Use Node.js 24.15 and pnpm 12.4.1. Work in the repository's native filesystem;
for the local WSL checkout, run Node and pnpm inside WSL.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Development runs at `http://127.0.0.1:4174/`. `pnpm dev` compiles translations
before starting Vite; the Paraglide plugin updates them during development.

## Checks

```sh
pnpm format
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

`check` verifies formatting, builds the site, then runs ESLint, TypeScript
and URL unit tests. Building first generates Paraglide and the route tree
on a fresh checkout. Browser tests serve the static output on port 4175.

Test the GitHub Pages base path as well as the root:

```sh
SITE_BASE_PATH=/Home-Page/ pnpm build
SITE_BASE_PATH=/Home-Page/ pnpm test
SITE_BASE_PATH=/Home-Page/ pnpm test:e2e
SITE_BASE_PATH=/Home-Page/ pnpm preview
```

In PowerShell, set the variable before running the commands:

```powershell
$env:SITE_BASE_PATH = '/Home-Page/'
pnpm build
pnpm test
pnpm test:e2e
pnpm preview
```

The build and preview must use the same base path. To return to `/`, unset
`SITE_BASE_PATH` and rebuild, or set it explicitly to `/`. In PowerShell,
use `Remove-Item Env:SITE_BASE_PATH` to unset it.

Generated translations and the route tree are not versioned.

## Content changes

Edit text in `packages/i18n/messages/{fr,en}.json`, public identity in
`packages/config/src/profile.json`, and projects in
`apps/web/src/features/projects/data/projects.ts`.

Add each new project route to the prerender list in `apps/web/vite.config.ts`
and check direct access in both languages. Store images in
`apps/web/public/assets` and resolve their paths with the asset helper.

Confirmed content rules are in `PRODUCT.md`. Additional projects, media and
wording refinements can be added after V1.

## GitHub Pages

The public URL is `https://westerbay.github.io/Home-Page/`.
Configure **Settings → Pages → Source** as **GitHub Actions**. Run the
**Publish portfolio** workflow manually from the Actions tab. Publishing
remains a `workflow_dispatch` action rather than happening on every push.

The workflow runs checks and browser tests, uploads `apps/web/dist/client`,
then deploys that artifact. CI separately checks `/` and `/Home-Page/`.
The build path comes from `configure-pages`, including when a custom domain
is configured later.

After a release, check the workflow result and the public French and English
pages. Do not infer a successful deployment from a local build alone.
The output retains compatibility redirects for the three old HTML URLs,
but contains no legacy site or comparison prototype.

## Git

Write English commits with prefixes and useful scopes, such as
`feat(web): ...`, `fix(i18n): ...`, `refactor(ui): ...` or `docs: ...`.
Synchronize with rebase and avoid merge commits. Committing and publishing
are separate operations.

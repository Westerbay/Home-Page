# Development

## Environment

Use Node.js 24 from `.node-version` and pnpm 12.4.1. Run tools in the checkout's
native filesystem; for a WSL checkout, run Node and pnpm inside WSL.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Development runs at `http://127.0.0.1:4174/`. Translations are generated before
Vite starts and updated during development. Generated translations, the route
tree and build output are ignored by Git.

## Build and preview

```sh
pnpm build
pnpm preview
```

The preview serves `web/dist/client` at port 4174. Set `PORT` to choose another
port. Stop the development server first if it already occupies that port.

For a prefixed deployment, use the same base path for build, preview and tests:

```sh
SITE_BASE_PATH=/Home-Page/ pnpm build
SITE_BASE_PATH=/Home-Page/ pnpm preview
SITE_BASE_PATH=/Home-Page/ pnpm test:e2e
```

In PowerShell, set the environment variable before the command:

```powershell
$env:SITE_BASE_PATH = '/Home-Page/'
pnpm build
pnpm preview
```

Unset `SITE_BASE_PATH` (or set it to `/`) and rebuild to return to root URLs.
Keep any guide settings consistent across builds of the same preview.

## Checks

```sh
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
pnpm test:html
pnpm audit:lighthouse
```

- `check`: Prettier, production build, ESLint, TypeScript and unit tests. Use
  `pnpm format` to apply formatting.
- `test:e2e`: Playwright against the static build on port 4175. Use
  `pnpm test:e2e web/test/e2e/project-stories.spec.ts` for a focused suite.
- `test:html`: Nu HTML checker over generated pages. Requires Java 17 or later;
  `JAVA` can point to its executable. Dependencies do not install Java.
- `audit:lighthouse`: mobile audits using Playwright Chromium and a temporary
  preview on port 4176. `pnpm audit:lighthouse --desktop /` audits desktop Home.

CI runs both `/` and `/Home-Page/`, including HTML validation, browser tests and
Lighthouse. The root job also verifies social-preview regeneration. Browser tests
use one worker in CI to avoid competing software-rendered WebGL scenes.
Run audits after builds and browser tests, not in parallel with them.

HTML errors fail validation. One exact Nu parser diagnostic for the standardized
`@view-transition` rule is excluded; the raw diagnostic remains in the report.
Reports are in `.cache/audits/{root,subpath}/`. CI retains audit results and failed
browser traces/screenshots as artifacts for 14 days. Lighthouse performance scores
are diagnostic lab measurements, not real-user Core Web Vitals.

## Optional AI guide

The guide is disabled by default. It requires two public build settings:

- `VITE_GUIDE_ENABLED=true`
- `VITE_GUIDE_URL`: the service origin, without path, query, credentials or fragment.
  HTTPS is required except for localhost; the client appends `/v1/chat`.

Vite does not load `.env` files here. Pass settings explicitly; never put an API
key, indexer token or service password in frontend variables. The separate service
must expose public chat and allow the exact preview/deployment origin through CORS.
A 401 must be fixed on that service, not by adding credentials to the browser.

Tests can use a local placeholder origin: Playwright intercepts chat requests and
supplies fixtures, so no API server or live inference is needed.

```sh
VITE_GUIDE_ENABLED=true VITE_GUIDE_URL=http://127.0.0.1:8788 pnpm check
pnpm test:e2e web/test/e2e/guide.spec.ts web/test/e2e/guide-stream.spec.ts
```

Repeat with `SITE_BASE_PATH=/Home-Page/` when changing URL handling. Guide tests
skip when the feature is disabled. For an interactive review with local fixtures:

```sh
GUIDE_QA=1 pnpm exec playwright test web/test/e2e/guide.qa.spec.ts --headed --workers=1
```

This pauses for inspection and labels sample answers. `sleep` simulates a
15-second pause and `error` simulates a failure. Close the browser to end the review. These
fixtures are not part of the shipped app. Rebuild with the intended public origin
before publishing an enabled guide.

## Editing content and UI

- Translations: `packages/i18n/messages/{fr,en}.json`.
- Public identity: `packages/config/src/profile.json`.
- Projects and illustrated stories: `web/src/features/projects/data/`.
- Shared theme/media tokens: `packages/ui/src/styles/globals.css`.
- Page layout and scenery: `web/src/styles.css` and `web/src/project-world.css`.

New public routes belong in `web/src/lib/site.ts` as well as the router. Preserve
both languages, canonical URLs and direct static access. Media sources and
regeneration commands are in [MEDIA.md](MEDIA.md).

When changing the UI, check keyboard access, mobile layouts, wide screens, both
themes and reduced motion. Theme and route transitions must preserve game progress,
chat history and draft input. Verify gallery links and media aspect ratios.

## Publishing

The public site is [portfolio.mathis-db.com](https://portfolio.mathis-db.com/).
GitHub Pages uses **GitHub Actions** as its source. The **Publish portfolio**
workflow in `.github/workflows/pages.yml` runs manually, checks the site and
uploads only `web/dist/client`. It reads the base path from GitHub Pages.
Pushing or merging a branch runs CI but does not deploy the site.

For a fork, update the public origin in `web/src/lib/site.ts`, profile/content and
the optional guide settings in the publishing workflow before deploying. The
service configured for this portfolio is not provided as a backend for forks.
Verify the workflow result and public URLs after publishing. Legacy `About.html`,
`Project.html` and `Prototype.html` redirects remain part of the static output.

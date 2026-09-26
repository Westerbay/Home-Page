# Mathis Dubuisson · portfolio

Games, 3D rendering and other projects, with a few words about me.

Public URL: [westerbay.github.io/Home-Page](https://westerbay.github.io/Home-Page/)

The site is available in French and English. It includes a project gallery,
individual project pages, an about page and links to GitHub and LinkedIn.
The theme follows the browser preference until you choose light or dark mode.
The homepage and Plants project page embed the original interactive WebGL
scene through the reusable [L-system component](https://github.com/Westerbay/The-Algorithmic-Beauty-of-Plants).
The Eyefox project page includes a playable puzzle using the reusable
[Eyefox component](https://github.com/Westerbay/Eyefox-Puzzle/tree/web).
Both integrations follow the site language and theme.
[Booster Break](https://booster.mathis-db.com/) leads the project selection,
with a screenshot, a project page and links to the live game and source.
The catalogue includes personal and academic projects.

## Stack

TypeScript, React, TanStack Start and Router, Tailwind CSS, Paraglide,
Zod and Sonner. Pages are generated as static HTML for GitHub Pages.
There is no application server to deploy.

## Development

Use Node.js 24.15 and pnpm 12.4.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open [localhost:4174](http://127.0.0.1:4174/).

```sh
pnpm format
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm check` runs formatting checks, the production build, linting, type
checking and unit tests. Browser tests run against the generated static site.

To build and preview the GitHub Pages path:

```sh
SITE_BASE_PATH=/Home-Page/ pnpm build
SITE_BASE_PATH=/Home-Page/ pnpm preview
```

Open [localhost:4174/Home-Page](http://127.0.0.1:4174/Home-Page/).
These environment variable examples use a POSIX shell; see the
[development guide](docs/DEVELOPMENT.md) for PowerShell.

## Project structure

- `apps/web`: routes, page features, project data and public assets.
- `packages/ui`: shared components, fonts and theme styles.
- `packages/i18n`: French and English messages and Paraglide configuration.
- `packages/config`: public profile and shared TypeScript configuration.
- `scripts`: static output preparation and the local preview server.

Text lives in `packages/i18n/messages`. The project catalogue is in
`apps/web/src/features/projects/data/projects.ts`.

## Publishing

GitHub Pages must use **GitHub Actions** as its source. Run the
**Publish portfolio** workflow manually from the Actions tab to publish V1
or a later update. It builds and checks the site, runs browser tests, then
publishes only `apps/web/dist/client`.

CI covers both `/` and `/Home-Page/`. The publishing workflow reads the path
from GitHub Pages, so a future custom domain can use the same build pipeline.
Compatibility redirects preserve the old `About.html`, `Project.html` and
`Prototype.html` URLs. The old implementation and comparison prototype are
not part of the maintained site.

See the [architecture](docs/ARCHITECTURE.md), [design decisions](docs/DESIGN.md),
[content rules](docs/PRODUCT.md) and [development guide](docs/DEVELOPMENT.md).

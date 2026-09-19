# Architecture

## Boundaries

`apps/web` combines React with TanStack Start and Router. Routes declare
navigation and metadata; features own their components and project data in
`src/features`. Small cross-cutting integrations live in `src/lib`.

`packages/ui` contains shared primitives: Button with Radix Slot and CVA,
Sonner notifications, the `cn` helper, theme styles and local fonts.
Feature-specific components stay with their features.

`packages/i18n` owns the French and English catalogues and Paraglide generation.
`packages/config` shares the public profile and TypeScript configuration.
Project data is validated with Zod where it is consumed. There is no remote
data layer or empty contracts package.

TanStack Query and Form can be added when a feature actually needs a remote
request or a form. Project filters currently use local React state.

## Rendering and languages

TanStack Start generates 14 HTML pages at build time. Only `dist/client` is
published. Server rendering is used for development and static generation;
no application server or remote function is deployed.

Paraglide uses URL and base-locale strategies. Its middleware isolates locale
state during concurrent prerendering. French uses the root, and English uses
`/en/`. The language control reloads the equivalent translated static page.

TanStack removes its base path before custom URL rewriting.
`src/lib/i18n/url-rewrite.ts` temporarily restores that prefix for Paraglide,
then lets the router add it back to public links. Tests cover both `/` and
`/Home-Page/`.

## Static assets and publishing

All maintained images are in `apps/web/public/assets`. Components use
`src/lib/assets.ts` to respect the deployment base path. They do not depend
on the removed root asset directories or comparison prototype.

`SITE_BASE_PATH` configures the build and preview server. The manual Pages
workflow reads this path from `actions/configure-pages` and uploads only
`apps/web/dist/client`.

`scripts/prepare-pages.mjs` adds `.nojekyll`, a static 404 page and redirects
from `About.html`, `Project.html` and `Prototype.html`. It does not copy the
old implementation. The preview server serves generated files directly;
there is no SPA fallback masking a missing static page.

The public project URL is `https://westerbay.github.io/Home-Page/`. A custom
domain can be configured later. Keep metadata consistent with the actual
published domain rather than inventing a future one.

## Technical reference

The frontend conventions and boundaries were informed by
[WebApp-Skull](https://github.com/mathis-gala/WebApp-Skull), inspected at commit
`561d00ad11e1c18be1c82227663d3d3d8b884132`. This is an internal engineering
reference, not a public portfolio link.
API, authentication and database features are outside V1.

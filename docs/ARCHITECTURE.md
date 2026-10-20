# Architecture

## Workspaces

`web` is the only application. TanStack Router routes declare navigation and
metadata; `web/src/features` owns page components and project data. Shared URL,
asset and SEO helpers live in `web/src/lib`.

- `packages/ui`: shared components, theme tokens and locally served fonts.
- `packages/i18n`: French/English catalogues and Paraglide generation.
- `packages/config`: public identity and shared TypeScript configuration.

pnpm links the workspaces. Turborepo builds translations before the application.
Project data is validated with Zod. Filters use local React state.

## Static rendering and URLs

TanStack Start prerenders the public routes into `web/dist/client`; only this
directory is deployed. Server rendering supports development and static
generation, not a production application server.

`web/src/lib/site.ts` owns the public origin, locales and route list used by the
build, canonical URLs and sitemap. French uses the root path; English uses `/en/`.
Paraglide middleware isolates locale state during concurrent prerendering.
`lib/i18n/url-rewrite.ts` bridges Paraglide with the router's deployment prefix.

Language controls link to equivalent static pages without JavaScript. After
hydration they also retain the query and fragment. Asset URLs go through
`lib/assets.ts`; avoid hard-coded root paths in components.

`scripts/prepare-pages.mjs` generates the sitemap, robots.txt, 404 page and legacy
redirects. The preview server serves those files without an SPA fallback, so a
missing page remains a real 404. Both `/` and `/Home-Page/` are tested.

## UI and media

`web/src/root.css` combines shared and feature styles in cascade order. Jersey 10
and Space Mono are bundled locally. Theme colours interpolate at the root through
registered CSS properties; project scenery crossfades independently. Reduced
motion disables these transitions. Changing theme must not remount games or chat.

Project media share frame and caption styles. Project badges use the common theme
palette, including on pages with scenery. Responsive images use the generated
`features/projects/data/project-images.json` manifest. Sources, encoding and
regeneration commands are documented in [MEDIA.md](MEDIA.md).

Internal navigation uses native View Transitions where available; other browsers
navigate normally. Semantic headings, lists and figures preserve the page outline.

## Interactive demos

The Eyefox and L-system feature wrappers load their versioned React packages only
on the client, near the viewport. Prerendered HTML contains a static preview, which
also remains available if the package cannot load. Without IntersectionObserver,
the wrappers load on mount.

The upstream packages own game state, controls, rendering and resource disposal.
The portfolio supplies locale and theme. The homepage uses compact L-system
controls; Plants exposes the full editor. Eyefox mounts only on its detail page.

## Optional AI guide

`features/guide` owns one TanStack AI session above the route outlet. The compact
dialog and full Guide page share the conversation, draft and companion. No request
is made merely by opening the guide. Public build settings enable the integration;
see [setup and tests](DEVELOPMENT.md#optional-ai-guide).

The transport posts directly to the configured service's `/v1/chat`, without
credentials. It accepts SSE with a legacy JSON fallback. Streamed text is
provisional until the final result validates, matches the accumulated text and the
stream ends cleanly. Only validated replies enter history; raw HTML and Markdown
images are not rendered. Citation metadata is validated internally.

Requests have a 30-second timeout, a 256 KiB stream limit and a 64 KiB event/JSON
limit. Errors, cancellation and malformed or truncated responses discard the
preview. There is no automatic retry or reconnect. A validated sleeping response
disables sending until its retry time; waking does not make a request.

Bounded snapshots live in sessionStorage, scoped by deployment prefix. Interrupted
requests are never replayed, and stopping or clearing invalidates late results.
Unit and browser tests cover these boundaries with local response fixtures.

The companion uses CSS sprite atlases. Eyefox selects the fox and carries it into
the full Guide; other entries use the adventurer. The sprite and conversation
persist while expanding or minimizing. The message renderer loads lazily when the
chat opens; the session and focus management remain mounted.

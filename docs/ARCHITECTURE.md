# Architecture

## Boundaries

`web` is the sole application and combines React with TanStack Start and Router. Routes declare
navigation and metadata; features own their components and project data in
`src/features`. Small cross-cutting integrations live in `src/lib`.

`packages/ui` contains shared primitives: Button with Radix Slot and CVA,
Sonner notifications, the `cn` helper, theme styles and local fonts.
Feature-specific components stay with their features.

`packages/i18n` owns the French and English catalogues and Paraglide generation.
`packages/config` shares the public profile and TypeScript configuration.
pnpm workspaces link the packages and Turborepo orders builds and checks;
the `web` build depends on generated translations.
Project data is validated with Zod where it is consumed. There is no remote
data layer or empty contracts package.

TanStack Query and Form can be added when a feature actually needs a remote
request or a form. Project filters currently use local React state.

## Rendering and languages

TanStack Start generates 22 HTML pages at build time. Only `dist/client` is
published. Server rendering is used for development and static generation;
no application server or remote function is deployed.

Paraglide uses URL and base-locale strategies. Its middleware isolates locale
state during concurrent prerendering. French uses the root, and English uses
`/en/`. The language control reloads the equivalent translated static page.

TanStack removes its base path before custom URL rewriting.
`src/lib/i18n/url-rewrite.ts` temporarily restores that prefix for Paraglide,
then lets the router add it back to public links. Tests cover both `/` and
`/Home-Page/`.

The router enables native View Transitions for internal navigation, including
back and forward. Global CSS fades in the new page over the previous one;
same-origin document navigation also opts in so language changes use the same
fade where supported. Reduced motion disables the animations, and unsupported
browsers navigate normally. The assistant retains its separate dialogue and
character transitions without remounting the shared session.

## Static assets and publishing

All maintained images are in `web/public/assets`. Components use
`src/lib/assets.ts` to respect the deployment base path. They do not depend
on the removed root asset directories or comparison prototype.

`SITE_BASE_PATH` configures the build and preview server. The manual Pages
workflow reads this path from `actions/configure-pages` and uploads only
`web/dist/client`.

`scripts/prepare-pages.mjs` adds `.nojekyll`, a static 404 page and redirects
from `About.html`, `Project.html` and `Prototype.html`. It does not copy the
old implementation. The preview server serves generated files directly;
there is no SPA fallback masking a missing static page.

The public project URL is `https://westerbay.github.io/Home-Page/`. A custom
domain can be configured later. Keep metadata consistent with the actual
published domain rather than inventing a future one.

## Technical reference

The frontend conventions and boundaries were informed by
[WebApp-Skull](https://github.com/Westerbay/WebApp-Skull). This is an internal engineering
reference, not a public portfolio link.
Authentication and database features remain outside the portfolio.

## Portfolio guide

`features/guide` owns one TanStack AI `useChat` instance above the route outlet.
The compact dialog and `/guide/` page share that instance and a draft. The
connection adapter sends the existing RAG JSON protocol directly to the public
chat route of the existing Cloudflare Worker, without credentials or a portfolio
backend. It emits the complete validated answer once, not simulated streaming.

The versioned, size-limited snapshot uses `sessionStorage`, scoped by the deployment
base. It is restored after hydration. Interrupted requests are never replayed;
stopping or clearing invalidates late results. The Worker owns availability:
only a validated HTTP 503 `sleeping` response blocks sending until `retry_at`.
The local timer enables manual retry and never makes a request.

The companion uses two transparent 4-column, 2-row atlases with native image
loading and CSS frame steps. The normalized Eyefox route selects the fox in
either language. Expanding from Eyefox keeps that character through the recorded
return location; other routes and direct entry to the Assistant page use the adventurer.
The shared session owns the short yawning, sleep and disappearance sequence,
so route changes cannot restart it. Only availability is saved: a reload restores
sleeping as a static hidden character. Reduced motion also skips the sequence.
The speech bubble above the character opens a compact NPC-style dialog, with a
tail pointing to the sprite below it. One persistent sprite stays at the same size
and position when the compact dialog opens or closes. Expanding enlarges the same
character inside the article: beside the conversation on desktop, and beside the
heading on mobile. It stays within the main content and above the footer.
Both sprite sheets are preloaded for the current character.
The bubble remains focusable after the
character disappears. Separate two-frame strips animate speech while a new
answer is revealed locally. TanStack still receives and saves the complete
response once; the reveal never changes the network protocol or saved messages.
The shared session owns its transient cursor, so expanding or minimizing does
not replay it. It completes automatically; there is no skip-animation control.
Reload and reduced motion show the complete saved text without replay; assistive technology receives
the complete answer, not character-by-character announcements.
The compact and expanded conversation surfaces share a native view-transition
name, and the persistent character has its own transition name. Navigation captures
the open panel and character before switching routes, then animates both into the
article composition. The surrounding page fades separately, including when returning
to the previous article. Reduced motion skips the transition,
and browsers without the API navigate normally.
There is no sprite engine, extra canvas or request on wake-up.
Notifications move to the top center only while the guide feature is enabled.

The optional guide is disabled unless both public build settings are valid.
Only a sanitized service origin reaches browser assets. No password is accepted
by the frontend. The interface calls the feature Assistant in both languages.
Both chat formats link to the Cloudflare-RAG repository beneath the composer.
Suggested questions send immediately through the same request path as the composer,
without populating or clearing its draft.
They are disabled until the session is ready, while a request is pending or during sleep.
Citation metadata is validated internally but is not displayed with the answer.
Markdown does not load images or execute raw HTML.

## Embedded L-system

The `features/lsystem` wrapper imports the shared `@westerbay/lsystem-react` library and stylesheet after mounting and visibility detection. This keeps WebGL out of prerendering and unrelated pages. The homepage uses compact controls; the Plants detail page uses the editor with symbol help. The component owns canvas events, GPU resources and rendering; unmounting a route disposes its scene. The wrapper supplies the current locale and resolved theme, and retains a static image if JavaScript or the library download is unavailable.

## Embedded Eyefox puzzle

The `features/eyefox` wrapper loads `@westerbay/eyefox-react` and its
stylesheet only after mounting, when the Eyefox detail approaches the viewport.
Browsers without IntersectionObserver load it on mount. The generated HTML
contains the existing project image; that preview also remains available if the
library cannot be downloaded, alongside a localized error message. Loading text
appears only once the browser has started the import.

The package owns the puzzle state and interaction. The portfolio passes its
current locale and resolved light/dark theme, without copying the game logic.
Only the Eyefox detail page mounts the game; Home and Projects cards keep their
static thumbnails. The wrapper adds no backend, store links or downloads.

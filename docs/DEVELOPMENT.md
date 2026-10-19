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

`check` verifies formatting, builds the site through Turborepo, then runs
ESLint, TypeScript and URL unit tests. Turbo builds Paraglide before the web
application; building also generates the route tree on a fresh checkout.
Browser tests serve the static output on port 4175.
They use one worker when `CI` is set and three locally. Software-rendered WebGL
scenes and 4K captures should not compete for the limited CI runner resources;
this follows [Playwright's CI guidance](https://playwright.dev/docs/ci#workers).
Both base-path jobs finish independently. Failed runs retain Playwright traces,
screenshots and error context in `playwright-failures-*` artifacts for 14 days.

### HTML, SEO and Lighthouse audits

The SEO browser tests inspect all 22 prerendered French and English pages before
JavaScript runs. They check canonical URLs, reciprocal language alternatives,
Open Graph/Twitter metadata, social image availability and sitemap consistency,
then exercise language navigation with and without JavaScript. These tests run
in both base-path CI jobs.

```sh
pnpm test:e2e web/test/e2e/seo.spec.ts
pnpm test:html
pnpm audit:lighthouse
pnpm audit:lighthouse --desktop /
```

`test:html` requires Java 17 or later (CI supplies Temurin 21) and uses the pinned
official Nu HTML checker to inspect all generated HTML, including the legacy
redirects and 404 page. Set `JAVA` to an executable path if Java is not on PATH.
The validator package's automatic Java downloader is disabled; installing npm
dependencies does not install a Java runtime. A standalone runtime is also
available from the [official Nu distribution](https://github.com/validator/validator/releases).

HTML errors fail the check. Nu currently rejects the standardized CSS
`@view-transition` rule; only that exact diagnostic is excluded from the failure
count. The raw diagnostics, including that known parser limitation and non-blocking
warnings, remain in `.cache/audits/{root,subpath}/w3c.json`. Do not broaden this
exception to hide unrelated CSS or HTML failures.

Lighthouse uses the installed Playwright Chromium and starts a temporary static
preview on port 4176 (`AUDIT_PORT` can override it). Its default mobile run covers
Home, Projects, SpellWar, PINNacle, About and the English homepage. Pass page paths
to select other routes; `--desktop` selects desktop emulation. JSON and HTML reports
are stored in `.cache/audits/{root,subpath}/lighthouse/`. Run audits sequentially,
after builds and browser tests, to avoid CPU contention or files changing mid-run.

The audit preview negotiates gzip for text resources, as production hosting does,
while keeping preview cache disabled. These are local lab measurements, not real
visitor Core Web Vitals or a verification of the CDN cache policy. Keep performance
scores diagnostic because machine load and WebGL emulation affect them. CI runs
the mobile homepage audit for each base path and retains its reports along with Nu
results as artifacts. Search Console ownership and actual Google indexing are
separate production checks; the repository cannot assert them.

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

## Optional AI guide

The guide is disabled by default. Enable it at build or dev time with
`VITE_GUIDE_ENABLED=true` and `VITE_GUIDE_URL` set to the public RAG **origin**,
without a path, query, credentials or fragment. The adapter adds `/v1/chat`.
HTTPS is required except for localhost. Vite does not load `.env` files here;
pass both public settings explicitly. Turbo includes them in its build cache key.
Keep the same settings on every `build` or `check` command for that preview.

For local browser tests, the following URL is intercepted by Playwright. No API
server is needed, and no request is sent to Cloudflare:

```sh
VITE_GUIDE_ENABLED=true VITE_GUIDE_URL=http://127.0.0.1:8788 SITE_BASE_PATH=/ pnpm check
SITE_BASE_PATH=/ CI=true pnpm test:e2e web/test/e2e/guide.spec.ts web/test/e2e/guide-stream.spec.ts
```

Repeat sequentially with `SITE_BASE_PATH=/Home-Page/`. Guide browser tests skip
when the built feature is disabled; ordinary page tests still run. Node tests
cover the protocol, bounded history, response limits and session recovery. Streaming
tests also exercise the real TanStack chat client with controlled `ReadableStream`
responses: partial text before completion, rejected final answers, interrupted
streams, Unicode boundaries, timeouts and persistence. Browser streaming fixtures
replace only the chat fetch locally and never contact the real service.

Never put the Worker's private password in a frontend variable or repository.
The public chat route must be enabled separately on the existing Worker before
a live integration can respond. Its health routes retain private authentication.
This feature does not deploy or activate the Worker. Rebuild without the local
test URL before an authorized publication.

For the real service, use its public origin explicitly:

```sh
VITE_GUIDE_ENABLED=true VITE_GUIDE_URL=https://small-rag.westerbay.workers.dev SITE_BASE_PATH=/ pnpm build
SITE_BASE_PATH=/ pnpm preview
```

The existing Worker must enable public chat and allow the browser's exact origin
in `PUBLIC_CHAT_ORIGINS`, such as `http://127.0.0.1:4174` for that preview or
`https://westerbay.github.io` for GitHub Pages. A different preview port is a
different origin. Open the normal preview without the Playwright demo interception;
the demo browser deliberately blocks the real service. A 401 on the chat preflight
means the deployed Worker still requires authentication; do not solve it by adding
a password to the client. The manual GitHub Pages workflow sets both public guide
settings for its build and browser tests. Tests intercept the configured chat URL
and abort unmatched chat requests, so publication checks do not consume live AI quota.

### Companion and manual review

The guide uses the fox on Eyefox and retains it when expanding from Eyefox into
the full Guide page. Other pages and direct Guide entry use the adventurer.
The character is selected from the current route and the session's return
location; changing its artwork does not remount the companion or reset the chat.
Each companion's `.guide-companion-sprite` child is mirrored with `scale: -1 1`
while the dock is expanded. Its View Transition wrapper stays intact, and
minimizing restores its compact orientation. During an `assistant` transition, the new character
snapshot turns from `rotateY(180deg)` to `rotateY(0)` over 420 ms. This is limited
to assistant transitions with motion enabled; reduced motion or no View Transition API uses the
final orientation immediately. Preserve the existing atlas, component instance
and speech animation; no JavaScript turn state is needed.
The transparent sprite atlases in
`web/public/assets/companion` are animated with CSS. The asset
provenance file records their source and frame layout. Their state follows the
shared chat session, including while the panel is closed. A validated sleeping
response runs a 0.9-second yawn, 1.6-second sleep and 0.3-second disappearance.
The speech-bubble button remains usable. Reloading during sleep or enabling reduced motion
skips that sequence. Only a successful manual request wakes the character; generic
errors never start a new sleep sequence.

Click the bubble above the floating character at the bottom right to open its
dialogue on desktop or mobile. When the feature is enabled, the Guide link remains
in the navigation, available through Menu on hydrated mobile pages and visible in
static HTML without JavaScript. It is not replaced by a sidebar launcher. On the full Guide page the compact launcher
is hidden, the character joins the conversation scene, and the navigation link
marks the active page. The full Guide uses the normal portfolio background and
theme, with a transparent conversation surface and no enclosing border or shadow.
Its composition is capped at 1480 px, with a 260–440 px character canvas anchored
at the bottom left beside the composer on desktop and bounded by the available
height. The conversation
fills the available height from its empty state, with the input at the bottom
and a separately scrolling transcript.
At 820 px of available width or less, the character stays near the heading above
the conversation on a 144 px canvas, reduced to 112 px on phones up to 600 px;
the input keeps its full width. On these phones, the footer follows the chat
instead of reducing its available height. Opening Menu lets the page grow and scroll.
Replies arrive from the Worker progressively while the sprite speaks. The first
text ends its thinking
pose; validated completion ends speech without an additional typing delay.
Expanding and minimizing preserve the stream. Reloading restores completed answers
only. Reduced motion keeps progressive text but disables the character animation.
Check that stopping, clearing or failing midway removes the provisional answer and
restores an untouched submitted draft. Legacy JSON responses still use the local
reveal for compatibility with older Worker deployments and existing test fixtures.
The Guide displays the answer without a separate sources section and links to
the Cloudflare-RAG repository as the source project. Its single
sprite keeps the same size and position when opening or closing the compact dialog.
On phones and short landscape screens it stays mounted but is hidden while that
panel is open, leaving more room for the conversation and composer.
Expanding moves and enlarges that same character into the article, to the left of
the conversation on desktop and beside the heading on mobile. Minimizing restores
its compact size and position. Check the conversation and character transitions
with a cold cache as well as reduced motion, and verify that the enlarged sprite
stays inside the main content above the footer. Before the shared 12% reduction,
the floating sprite uses a 92 px canvas on phones and short landscape screens,
112 px on tablets, scales from 224 px at a 1440 px viewport to 360 px at 3840 px,
and uses 128 px on desktop when viewport height is at most 650 px. Its speech
bubble scales with it. The compact dialog retains its opaque surface; on phones
and short landscape screens it sits near the safe bottom edge and uses the
available viewport height.
The thin transcript scrollbar is visible while scrolling and hides after a short
pause. Its reserved gutter keeps the text width stable.

To review the actual UI in a browser with local sample responses, build with the
test URL above, then run:

```sh
GUIDE_QA=1 SITE_BASE_PATH=/ pnpm exec playwright test web/test/e2e/guide.qa.spec.ts --headed --workers=1
```

This opt-in test opens the existing static preview and pauses for human inspection.
It intercepts requests in Playwright, blocks other origins, and starts no API or
fixture server. Ordinary questions receive a clearly labelled local sample reply.
Send `sleep` or `dodo` to exercise a 15-second rest, or `error` to exercise a generic
failure. After the rest, submit again manually. These controls exist only in the
test; they are not included in the application bundle. Close the browser or stop
Playwright to end the review. The normal automated run skips this interactive test.

Check both companions, the page/panel transition, mobile keyboard and Escape
behavior, and the sleep sequence with reduced motion on and off. Verify the
Guide navigation link and floating launcher, their keyboard operation in
300 px-high desktop windows, the active link on the Guide page and navigation
without JavaScript. Confirm the companion stays at the bottom right rather than
joining the sidebar. Check the larger floating sprite and bubble at 3840 px,
and confirm the full Guide stays on the normal background after entry from Eyefox.
Check that Eyefox, L-system controls and Contact copy notifications remain
reachable. Automated checks do not imply human visual acceptance.

### Desktop navigation texture

At viewport widths of at least 1101 px, `.site-header::before` displays
`web/public/assets/navigation/book-page.webp` behind the real navigation.
The opaque white and pale grey paper has straight edges, a fine binding crease
on the left and thin stacked page edges on the right. It is decorative,
with no text or interactive content;
the pseudo-element ignores pointer events and leaves links and focus indicators
above it. The single texture uses `right center / 106% 100%` sizing, placing the
source image's left binding crease outside the rail while keeping the right-hand
page edges visible. The image file remains unchanged. The header keeps
`background: var(--surface)` and `box-shadow: 6px 0 18px #00000018`.
Keep the existing rail dimensions, navigation content and expanded Projects
branch. The mobile header does not use this texture.

Light mode uses `brightness(1)`; dark mode uses `brightness(0.19)` to produce
dark graphite. The neutral source image needs no saturation filter.
Only the texture's filter transitions over
500 ms with ease-in-out timing, and reduced motion disables that transition.
The desktop rail has no backdrop blur. Review keyboard focus, link contrast
and independent navigation scrolling on short windows in both themes, including
Eyefox and SpellWar; mobile layout and controls must remain unchanged.

### Project scenery and themed interface

Palette colours are registered as inherited CSS colour properties with
`@property`. Their variables transition on `:root` over 500 ms with ease-in-out
timing, covering ordinary UI tokens and world tokens used by Eyefox, SpellWar and the
compact chat. The theme class drives manual, system and synchronized preference
changes; rapid toggles reverse the native CSS transition. This adds no View
Transition, timer or effect and leaves local hover, focus and transform behavior
intact. Reduced motion disables the palette transition. The next-themes script
applies the initial preference before display; there is no JavaScript entrance
animation. The scenery's 900 ms opacity transition remains separate.

`web/src/project-world.css` defines the light and dark interface palettes for
Eyefox, SpellWar and the opaque compact chat. Eyefox uses the forest pair;
SpellWar uses its own floating-platform pair. The full Guide uses ordinary
portfolio tokens and no scenery. Daylight uses
`#fffefc` surfaces, `#252525` text,
`#625f5a` secondary text, `#f8f7f4` raised surfaces, `#8c857a` control borders
and `#97531c` accent text. Dark mode retains the graphite palette. Primary action
fills stay amber `#f2c66d` in both modes.

Fixed `::before` and `::after` layers hold the day and dusk images. The `.dark`
rule changes the dusk layer's opacity with a 900 ms ease-in-out transition and
switches the interface tokens. The contrast veil stays constant. Reduced motion
disables the scenery transition. Both layers use the same dimensions, top
alignment and cover sizing to keep the scenery aligned. Eyefox and SpellWar map
world tokens onto the ordinary site tokens and use the matching light or dark
`color-scheme`. Each route supplies its own `--world-scenery-day` and
`--world-scenery-dusk` URLs. Text directly over either landscape keeps white text
in both modes. SpellWar's daytime setting is a decorative interpretation; its
authentic screenshots and recorded gameplay must remain unchanged.
The portalled Guide panel repeats the token mapping because it lives outside
`.site-frame`.

The Eyefox scene derives its theme from `useTheme().resolvedTheme` and passes
`light` or `dark` to the existing puzzle instance. Do not add a theme-dependent
React key or otherwise remount the game, companion or conversation when switching
themes: game progress, conversation and draft must persist.

The Eyefox game uses `--world-panel` at 78% opacity with an 18 px backdrop blur
and restrained saturation when supported. Only its background is translucent:
text, sprites, the difficulty selector and grid mattes remain sharp and opaque.
Its secondary text is mixed closer to the main ink to preserve contrast over
the scenery. A CSS support query keeps the original opaque surface as a fallback.
The compact chat retains its opaque `--world-panel` surface; both keep visible
`--world-control` borders. The full Guide
conversation has no enclosing surface. On Eyefox and SpellWar, `.project-reading`
remains transparent, without a background, border, content-level shading or
box-like padding and negative margins. Preserve the shared project layout:
technologies on the left and introductory prose on the right, then story headings
on the left, prose on the right and captures below. White text uses a restrained
shadow; its main contrast comes from the fixed scenery veil, not a layer attached
to the article. Project captures and SpellWar's video use a matte matching the current theme. Keep
the scenery and veil fixed while the page scrolls.

During manual and browser review, switch both system and saved themes. Confirm
that UI and world colours interpolate over 500 ms, rapid toggles reverse cleanly,
and reduced motion makes both the palette and scenery changes instant. Confirm
that each project's scenery, computed text, panel, control colours and native colour
scheme change together, while the veil, game progress, conversation and draft
remain unchanged. Headings, links and article text directly over the scenery must
remain white on transparent backgrounds. Check their contrast throughout the
scroll across the shared project layout, including on narrow and 3840 px-wide
screens.
Repeat after reload and after leaving the scene. Check the compact portal on an
ordinary page as well as the full Guide; neither route entry nor companion
selection should bring either project landscape onto the full Guide. Use the linked contrast
and hierarchy references
in [DESIGN.md](DESIGN.md#contrast-and-visual-hierarchy-references) to assess text,
input borders and focus indicators against their actual backgrounds.

## Content changes

Edit text in `packages/i18n/messages/{fr,en}.json`, public identity in
`packages/config/src/profile.json`, and projects in
`web/src/features/projects/data/projects.ts`.

Add each new project route to `publicPagePaths` in `web/src/lib/site.ts`
and check direct access in both languages. Store images in
`web/public/assets` and resolve their paths with the asset helper.

At a `content` container width of at least 1200 px, `.story-images` and
`.story-video` use 88% width with centered margins. Preserve their existing
columns, order and proportions. Keep smaller layouts, interactive scenes,
hero images, thumbnails and generative galleries unchanged. Verify the rule
against the content width after navigation, not the viewport width.

Confirmed content rules are in `PRODUCT.md`. Additional projects, media and
wording refinements can be added after V1.

## GitHub Pages

The public URL is `https://portfolio.mathis-db.com/`. The former
`https://westerbay.github.io/Home-Page/` address redirects to the custom domain.
Configure **Settings → Pages → Source** as **GitHub Actions**. Run the
**Publish portfolio** workflow manually from the Actions tab. Publishing
remains a `workflow_dispatch` action rather than happening on every push.

The workflow runs checks and browser tests, uploads `web/dist/client`,
then deploys that artifact with the Assistant enabled against the existing public
Worker. CI separately checks `/` and `/Home-Page/` with the feature disabled.
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

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

The default companion is an adventurer; Eyefox uses a fox, including when expanding
from Eyefox into the Assistant page. Direct entry to that page uses the adventurer.
Both are transparent
sprite atlases in `web/public/assets/companion`, animated with CSS. The asset
provenance file records their source and frame layout. Their state follows the
shared chat session, including while the panel is closed. A validated sleeping
response runs a 0.9-second yawn, 1.6-second sleep and 0.3-second disappearance.
The speech-bubble button remains usable. Reloading during sleep or enabling reduced motion
skips that sequence. Only a successful manual request wakes the character; generic
errors never start a new sleep sequence.

Click the bubble above the character to open its dialogue. Replies arrive from
the Worker progressively while the sprite speaks. The first text ends its thinking
pose; validated completion ends speech without an additional typing delay.
Expanding and minimizing preserve the stream. Reloading restores completed answers
only. Reduced motion keeps progressive text but disables the character animation.
Check that stopping, clearing or failing midway removes the provisional answer and
restores an untouched submitted draft. Legacy JSON responses still use the local
reveal for compatibility with older Worker deployments and existing test fixtures.
The Assistant displays the answer without a separate sources section and links to
the Cloudflare-RAG repository as the source project. Its single
sprite keeps the same size and position when opening or closing the compact dialog.
Expanding moves and enlarges that same character into the article, to the left of
the conversation on desktop and beside the heading on mobile. Minimizing restores
its compact size and position. Check the conversation and character transitions
with a cold cache as well as reduced motion, and verify that the enlarged sprite
stays inside the main content above the footer.
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

Check both characters in light and dark themes, the page/panel transition, mobile
keyboard and Escape behavior, and the sleep sequence with reduced motion on and
off. Verify that the Eyefox game, L-system controls and Contact copy notification
remain reachable. Automated checks do not imply human visual acceptance.

## Content changes

Edit text in `packages/i18n/messages/{fr,en}.json`, public identity in
`packages/config/src/profile.json`, and projects in
`web/src/features/projects/data/projects.ts`.

Add each new project route to the prerender list in `web/vite.config.ts`
and check direct access in both languages. Store images in
`web/public/assets` and resolve their paths with the asset helper.

Confirmed content rules are in `PRODUCT.md`. Additional projects, media and
wording refinements can be added after V1.

## GitHub Pages

The public URL is `https://westerbay.github.io/Home-Page/`.
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

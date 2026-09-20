# Project context

## V1 scope

The maintained portfolio uses React, TypeScript and TanStack Start/Router in
`apps/web`, with shared packages for UI, translations and configuration.
Home, the filterable project list, three project pages, About and Contact
are implemented. French and English pages are generated as static HTML.

Mathis has authorized V1 publication and removal of the old implementation.
The release excludes the comparison prototype and legacy root HTML, CSS,
JavaScript and shared asset directories. Keep the generated compatibility
redirects for `About.html`, `Project.html` and `Prototype.html`.
Current frontend assets live independently in `apps/web/public/assets`.
The external asset migration covers five consumers: the `web` branches of
Eyefox-Puzzle, SpellWar, OSProject and Bachelor-Side-Projects, plus the
`main/index.html` page of The Algorithmic Beauty of Plants. Each page gets
its own `shared/` assets. The subsequent ABOP component refactor removes
that project's old page shell and shared assets entirely.

The public URL is `https://westerbay.github.io/Home-Page/`. Publishing uses
the manual **Publish portfolio** workflow, with GitHub Pages configured to
use GitHub Actions. Check the workflow result and public site when releasing;
these notes do not stand in for release verification.

## Approved design

Mathis approved **Atlas × Signal** on 19 September 2026: soft orange
`#e99245`, warm white `#fffefc`, and charcoal in dark mode. Small visual
refinements can follow V1.

Desktop content uses 90% of the viewport, capped at 2600 px. Typography and
visuals adapt up to 3840 px. The container has no percentage padding that
shrinks its usable width after the cap. The home illustration and Plants project page use the shared React/WebGL L-system component from the ABOP repository. Home shows compact controls; the project page includes the full editor and symbol-help modal. It is loaded only on the client when the scene approaches the viewport, with a static image in generated HTML.

The theme follows the browser until a manual preference is saved. The
sun/moon button switches between light and dark. Language labels stay in
FR / EN order, with the active locale distinguished and no flags.

## Confirmed identity and tone

Mathis Dubuisson is an ENSICAEN engineering graduate and a
**Product & Software Engineer**. No employer name is displayed. His work
covers client conversations, product design, software, infrastructure,
pipelines and deployment. These facts do not need to be asked again.

He codes for fun. Maths, physics and striking visual results motivate him;
he enjoys learning different ways to solve problems and keeping software
architecture clean. His interest in AI includes both model architecture
and software that uses models. Making a game or telling a story could be
a future interest, not a project already started.

Keep the voice personal, direct and understated. Avoid sales language,
invented achievements and CV-style positioning. Do not use em dashes in
site copy or terminal full stops in headings and short title-like text.
The About lead is simply “Product & Software Engineer”.

## Confirmed projects

SpellWar, The Algorithmic Beauty of Plants and Eyefox Puzzle are academic
projects. Mathis wants to keep all three; personal projects can be added
later. He made each of them himself. Do not repeatedly emphasize that fact
in public descriptions: focus on what the projects do and how they work.

SpellWar uses a custom physics model, PBR rendering, collisions and terrain
generation. Do not invent a terrain-generation algorithm. Mathis confirmed
that he wrote its code from scratch without AI assistance; retain this as
background, not a statement in the portfolio.

The Algorithmic Beauty of Plants came from reading ABOP and putting its
ideas into practice with L-systems and 3D rendering in WebGL. Mathis wants
a simple account of that research and implementation, not an inflated
achievement or a new question about its biggest challenge. Maths and physics
were mentioned without details that justify claiming a particular simulation.
The terms “mat” and “base 64” were ambiguous; do not interpret them or add
them to public copy.

Eyefox Puzzle is an Android mobile game. It is no longer available in app
stores, but the portfolio does not need to display that status. Keep the
source repository link and do not add store buttons. Do not infer a reason
or date of removal, an end to development, or an available APK.

Earlier Eyefox-Puzzle repository updates were published as `6a49278` on
`main` (README context and store availability) and `76622fd` on `web`
(replacing the store button with a source-code link). Those corrections
remain; later requests to simplify the portfolio copy do not undo them.

Only the Westerbay GitHub account is public on the portfolio. Skull stays
in `features/projects/data/drafts.ts`, outside the public catalogue, without
a secondary-account URL.

## Contact and follow-up work

Contact is **GitHub and LinkedIn only**. Do not display an email address on
the portfolio or ask this question again. Eyefox's historical privacy-policy
contact is a separate record and remains unchanged.

Additional screenshots, videos, project notes, personal projects, English
wording refinements and a future custom domain can be handled later. They
do not block the authorized V1 release.

## Documentation

- [PRODUCT.md](PRODUCT.md): scope and content rules.
- [ARCHITECTURE.md](ARCHITECTURE.md): structure and rendering.
- [DESIGN.md](DESIGN.md): approved visual direction.
- [REUSE.md](REUSE.md): shared components and helpers.
- [DEVELOPMENT.md](DEVELOPMENT.md): commands and publishing.

## Interactive L-system component

The versioned @westerbay/lsystem-react package comes from a GitHub release asset, with its integrity pinned in the lockfile. Upgrade the dependency when releasing component changes; do not copy engine code into this repository. The scene follows the portfolio locale and resolved theme. Gallery cards retain static thumbnails.

## Interactive Eyefox puzzle

The Eyefox project detail uses the shared `@westerbay/eyefox-react` component
from the Eyefox-Puzzle repository. It loads on the client near the viewport and
follows the portfolio language and theme. Prerendered HTML retains the existing
Eyefox image. Home and Projects cards remain static. Keep the package as the
source of game logic and upgrade its dependency when releasing changes.

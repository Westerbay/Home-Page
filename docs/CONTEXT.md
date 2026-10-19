# Project context

## V1 scope

The maintained portfolio uses React, TypeScript and TanStack Start/Router in
the root `web` workspace, with shared packages for UI, translations and
configuration. Turborepo orders workspace builds and checks.
Home, the filterable project list, six project pages, About and Contact
are implemented. French and English pages are generated as static HTML.
An optional AI guide adds a compact chat and a full Guide page in both languages.
It calls the existing public RAG Worker when explicitly enabled; it has no
frontend password or additional backend. See DEVELOPMENT.md for local testing.

Mathis has authorized V1 publication and removal of the old implementation.
The release excludes the comparison prototype and legacy root HTML, CSS,
JavaScript and shared asset directories. Keep the generated compatibility
redirects for `About.html`, `Project.html` and `Prototype.html`.
Current frontend assets live independently in `web/public/assets`.
The external asset migration covers five consumers: the `web` branches of
Eyefox-Puzzle, SpellWar, OSProject and Bachelor-Side-Projects, plus the
`main/index.html` page of The Algorithmic Beauty of Plants. Each page gets
its own `shared/` assets. The subsequent ABOP component refactor removes
that project's old page shell and shared assets entirely.

The public URL is `https://portfolio.mathis-db.com/`. Publishing uses
the manual **Publish portfolio** workflow, with GitHub Pages configured to
use GitHub Actions. Check the workflow result and public site when releasing;
these notes do not stand in for release verification.

## Approved design

Mathis approved **Atlas × Signal** on 19 September 2026: soft orange
`#e99245`, warm white `#fffefc`, and charcoal in dark mode. The October 2026
refinement keeps the portfolio structure, replaces typography with locally
served Jersey 10 for headings, navigation and actions, with Space Mono for body
text, and moves desktop navigation to the left as plain text links. Eyefox uses
the generated pixel-art forest; SpellWar has its own floating-platform landscape,
with stone slabs, violet points and red trees. Both pair daylight and dusk
versions of the same composition, crossfading over 900 ms (instant with reduced
motion). SpellWar's brighter daytime setting is a decorative interpretation;
its real screenshots and gameplay remain unchanged. Both pages' surfaces and
controls follow the theme, with cream surfaces and dark text by day, graphite
surfaces and light text at dusk, and amber primary actions in both modes. Article
text stays white directly over each landscape and keeps the shared project layout:
technologies on the left and introductory text on the right, then story headings
beside their prose and captures below. It has no background, frame or content-level
shading. Contrast comes from the fixed environment's veil and a restrained text
shadow while content scrolls. The Eyefox game retains its opaque panel; project
captures and SpellWar's video retain a matching light or dark matte.
The full Guide uses the normal portfolio background, with an unframed conversation
beside the character. Other project content and visuals remain unchanged.

The desktop navigation sits against the left viewport edge. It scales from
about 256 px wide at a 1440 px viewport to 416 px at 3840 px, with a 24–32 px
left inset, larger type, avatar and spacing. Its nearly opaque, blurred surface
is fully opaque on Eyefox and SpellWar. Project links stay expanded on every
desktop page; the parent is emphasised only on project routes and the active
page is identified separately. There are no internal section links. Mobile
keeps the project branch hidden. Navigation scrolls independently on short
screens, with compact utility controls. The Guide remains a normal navigation
link, while its companion floats at the bottom right outside the sidebar.
Content is centered separately in the remaining space, capped at 2600 px.
Typography and visuals adapt up to
3840 px. The home illustration and Plants project page use the shared React/WebGL L-system component from the ABOP repository. Home shows compact controls; the project page includes the full editor and symbol-help modal. It is loaded only on the client when the scene approaches the viewport, with a static image in generated HTML.

The theme follows the browser until a manual preference is saved. The
sun/moon button switches between light and dark on every page. On Eyefox and
SpellWar it changes each project's scenery and interface palette; the
Guide follows the ordinary portfolio theme. Palette colours transition over
500 ms, including system theme changes; reduced motion makes this instant.
Theme changes preserve game progress, conversation and draft. Language labels stay in
FR / EN order, with the active locale distinguished and no flags.

When the feature is enabled, the Guide link stays visible in the navigation on
desktop and mobile, including before hydration and without JavaScript. The
floating companion and its speech-bubble launcher sit at the bottom right;
there is no separate Guide call to action inside the sidebar. On the full Guide,
the same character sits beside a conversation that fills the available height
from the empty state, with the input at the bottom. The navigation link marks the
active page. The floating sprite and its bubble grow on large screens, with
smaller sizing on mobile and short desktop windows. Eyefox uses the
fox, which stays with the visitor when expanding
from Eyefox into the Guide. Other pages and direct Guide entry use the adventurer.

## Confirmed identity and tone

Mathis Dubuisson is an ENSICAEN engineering graduate and a
**Product & Software Engineer**. Galadrim may be named in the About journey,
as explicitly approved on 17 October 2026. Client identities remain private. His work
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
projects. Mathis wants to keep all three. He made each of them himself. Do not repeatedly emphasize that fact
in public descriptions: focus on what the projects do and how they work.

SpellWar uses a custom physics model, PBR rendering, collisions and terrain
generation. Do not invent a terrain-generation algorithm. Mathis confirmed
that he wrote its code from scratch without AI assistance; retain this as
background, not a statement in the portfolio.

The SpellWar page ends with a short, silent gameplay clip supplied by Mathis,
showing movement between differently oriented platforms. It replaces the last
still image and autoplays muted in a loop, as requested by Mathis. Native
controls remain available to pause or resume playback. The clip has no audio
track. Source selection and encoding details are recorded in SPELLWAR-MEDIA.md.

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

Booster Break is a personal, collaborative project with contributions from
Mathis's colleagues. It appears first in the catalogue and in the three-project
homepage selection, followed by SpellWar and Plants. Eyefox remains in the full
catalogue. The detail page links to the live app at `https://booster.mathis-db.com/`
and the Westerbay repository. Describe the pack opening, collection, trading,
three-card duels and WebGL effects without assigning colleagues' work to Mathis.
Use a real public screenshot, not an embedded authenticated application.

PINNacle is an academic group contribution focused on explaining physics-informed
neural networks through activation regions and their spatial density. The relevant
code and Mathis's commits are on the upstream `setup` branch, not `main`.
His contributions include activation extraction (ReLU, tanh, SiLU), quantile
sampling, binary export, and parts of the C++/OpenGL viewer, camera and video
frame export. Density statistics and heatmaps belong to the group work.
The catalogue includes it under AI & science; the homepage keeps its three cards.
The cover is a genuine frame extracted from the supplied group defense. The page
also includes its ReLU extraction diagram, ReLU/tanh/SiLU region figures and
collective density plots, with their interpretation limits and source captions.
See PINNACLE-MEDIA.md for the source slides and extraction details.

StyleGAN & Cheap DiT is an academic project implementing compact PyTorch
models for 256 × 256 image generation: a StyleGAN-inspired GAN and a latent
diffusion transformer using a convolutional VAE. It appears under AI & science.
The page includes genuine saved training outputs, GAN examples and VAE
reference/reconstruction comparisons. Media provenance and local generation
commands are in GENERATIVE-MEDIA.md. The homepage keeps its three cards.
A public generation service is a V2 idea, deferred by Mathis. Do not add a
Worker, API integration, hosting or runtime generation to the portfolio now.

## Contact and follow-up work

Contact includes **contact@mathis-db.com**, GitHub and LinkedIn. The email
address is explicitly approved for public display and opens the visitor’s mail
client through a mailto link. Eyefox’s historical privacy-policy contact is a
separate record and remains unchanged.

Additional screenshots, videos, project notes, personal projects and English
wording refinements can be handled later. They
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
from the Eyefox-Puzzle repository. It loads on the client near the viewport,
follows the portfolio language and resolved light or dark theme. The theme is
passed as a prop without a theme-dependent key, preserving the mounted puzzle
and its game state when the theme changes. Prerendered HTML retains the
existing Eyefox image. Home and Projects cards remain static. Keep the package as the
source of game logic and upgrade its dependency when releasing changes.

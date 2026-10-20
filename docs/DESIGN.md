# Visual design

The portfolio keeps the editorial layout and project grid of **Atlas × Signal**.
The October 2026 refinement uses Jersey 10 and Space Mono, quiet text navigation on the left of
desktop screens, a forest setting reserved for Eyefox, a distinct floating-platform
landscape for SpellWar and a pixel-art arena for Booster Break. The full AI Guide uses
the normal portfolio background. Preserve
the existing content, media and interactive scenes. The desktop navigation uses
opaque white and pale grey paper with straight edges and thin stacked page edges
on the right, with no visible binding crease, keeping its text links
clear and free of ornamental game-style frames.

## Colour and type

The palette is centralized in `packages/ui/src/styles/globals.css`:

- Light: background `#fffefc`, surface `#f8f7f4`, orange `#e99245`.
- Dark: background `#1b1b1b`, surface `#252525`, orange `#eaa566`.
- Orange buttons use dark text for readable contrast.
- Jersey 10 is served locally for headings, navigation and actions, at its native
  400 weight with open letter spacing. Small controls use larger type to keep
  the pixel-shaped letters readable.
- Space Mono is served locally for paragraphs, metadata and form input, with
  regular and bold weights and their italics. It keeps longer text readable
  alongside the pixel headings.
- Eyefox uses a generated forest, SpellWar a separate landscape of floating
  stone platforms, violet points and red trees, and Booster Break a pixel-art
  arena. Eyefox and SpellWar pair daylight and dusk, while Booster Break pairs
  daylight and night. Each keeps the same composition, with themed interface
  surfaces and story-media mattes.
  Light mode uses cream surfaces `#fffefc`, dark text `#252525`, secondary text
  `#625f5a`, raised surfaces `#f8f7f4`, control borders `#8c857a` and accent text
  `#97531c`. Dark mode uses graphite `#19191c`, opaque panels `#27272b`, light text
  `#f7f4ee`, secondary text `#cac6c0` and control borders `#85858f`; `#55555e`
  is reserved for quieter separators. Primary action fills stay amber `#f2c66d`
  with dark text in both modes. These world tokens live in
  `web/src/project-world.css` and also supply the opaque compact chat. The full
  Guide follows the ordinary portfolio tokens. Native controls follow the light
  or dark colour scheme. Text directly over these landscapes remains white in both modes.

The public site uses this one direction. The comparison prototype is not
part of the maintained implementation.

## Layout

Above 1100 px, the shell occupies the full viewport width. The sticky navigation
rail grows from about 256 px at a 1440 px viewport to 416 px at 3840 px, while its
left inset stays within 24–32 px. Main links grow from 24 to 42 px, project links
from 21 to 33 px, and the avatar from 38 to 56 px. Link spacing scales with them.
The `--sidebar-width` token defines the navigation rail; the floating companion
and compact Guide panel sit at the bottom right, independently of the rail. The content
column is centered in the remaining space and capped at 2600 px. Do not center the
whole shell: that would push navigation away from the edge on large screens.
Mobile spacing remains separate.

From 1101 px, the navigation sits on opaque white and pale grey paper with straight
edges and thin stacked page edges on the right. The original image contains a
left binding crease; right alignment at 106% width keeps it outside the visible
rail while preserving the right-hand pages.
The texture fills the existing rectangular rail, with a surface background and
a subtle side shadow.
The generated texture is decorative; the links,
identity and controls remain real interface elements. Dark mode dims the paper
to dark graphite, and its filter transitions over 500 ms, instantly with reduced
motion. The desktop rail uses no backdrop blur. Links remain plain text, with
a stronger colour and fine underline on
the current page. The six project links appear on desktop while viewing a project
detail page, or on any other page when the full navigation fits without scrolling. A
ResizeObserver measures the available navigation height and the full list,
including wrapped titles and gaps; resizing can expand or fold the branch.
Project detail pages retain the branch even when scrolling is necessary. The
parent branch is emphasised only inside Projects, and only the current page link
receives `aria-current`. There are no internal page-section links. The link
area centers its links vertically when they fit and scrolls independently on
short screens; identity and utility controls remain
visible. Below 650 px of viewport height, navigation type, spacing and tools use
their compact sizes even on a wide screen.
Language and theme controls sit at the bottom of the rail. When enabled, the
Guide stays visible as a normal navigation link, including without JavaScript
and before hydration. Its companion and speech-bubble launcher float at the
bottom right on desktop and mobile, outside the sidebar. There is no separate
sidebar Guide call to action. On the full Guide, the navigation link marks the
active page and the character is part of the conversation scene.
The theme switch remains available on every page.
At 1100 px and below, a 76 px header keeps the identity and a labelled Menu
button on one row. The disclosure expands in the document flow and contains the
main links plus language and theme controls. Links use 26 px Jersey with at least
48 px of height; utility controls provide 44 px targets. The Projects parent is
underlined on project pages. Navigation closes after a link, Escape or crossing
the desktop breakpoint; Escape restores focus to Menu. Static HTML without
JavaScript keeps the navigation visible. There is no mobile paper texture or
desktop project branch. At 380 px and below, the secondary role line is hidden
to keep the identity readable. Content
container queries respond to the available column width rather than the full
viewport, including the full Guide page.

The full Guide uses the normal portfolio background and a composition capped at
1480 px. Its heading sits above the conversation, which fills the available height
even when empty. The input stays at the bottom and the transcript has its own
scroll area. On desktop, the character is anchored at the bottom left beside the composer;
its canvas grows from 260 to 440 px, bounded by the available height. At 820 px
of available width or less, the character stays near the heading with the
conversation and full-width input below, using a 144 px
canvas. On phones up to 600 px, the portrait is 112 px, the heading is compact
and the footer follows the chat instead of reducing its available height.
An open navigation menu lets the page grow and scroll. The conversation is transparent,
without an enclosing border or shadow. The character persists when expanding or
minimizing the chat. Eyefox uses the fox, including a Guide opened from Eyefox;
other routes and direct Guide entry use the adventurer. Both use the existing
animation state machine. In the full Guide, both companions are mirrored to face
the chat on their right; minimizing restores their compact orientation. A 420 ms
half-turn accompanies the assistant transition, using the existing atlases. Reduced
motion or an unavailable View Transition API applies the final direction immediately.
Both floating companions use 75% of their responsive base size, about 15% smaller
than the previous floating size. Their canvas is about 69 px on phones and short
landscape screens, grows from 168 px at a 1440 px viewport to 270 px at 3840 px,
and uses 96 px on desktop windows at most 650 px high. The speech bubble and
compact chat stay anchored above the smaller canvas. The floating dock has an 8 px
minimum bottom inset and respects the safe area. A 10.4% vertical sprite offset compensates for the fox
atlas’s transparent foot padding, aligning its idle paws with the adventurer’s
feet in both compact and expanded modes. Its launcher bubble follows that offset. The full Guide keeps its
desktop character size. The compact chat keeps its opaque surface. On phones and
short landscape screens it sits near the safe bottom edge and uses the available
viewport height; the persistent floating character is hidden while this panel is
open. Input text is at least 16 px on these formats, and closing, expanding and
theme controls retain usable touch targets.

Type and visuals scale up to 3840 px. Paragraphs keep a limited reading width
and the hero illustration remains proportionate to the text. The project
listing uses three columns above 1100 px, two on tablets and one on mobile.
Images use a 2:1 ratio with a maximum height of 360 px.

At 820 px of available content width or less, the home hero stacks and the
selected projects use two columns, then one at 600 px. Supporting descriptions
remain readable instead of compressing three cards into a tablet-width row.
Mobile footer links retain their centered arrangement with 44 px touch targets.

Home retains the three selected projects in equal-width columns. Their media
frames share a 1.6 ratio and contain the full images. Link labels and bottom
rules align across the row. Home-specific descriptions highlight each project's
techniques without changing the catalogue copy. The research links keep their
editorial rows, with small lazy-loaded thumbnails and one link per project.

## Illustration and images

The home scene uses the original ABOP WebGL renderer through the shared L-system React package. Its compact controls switch presets and adjust the camera. The Plants detail page includes the full editor, with the symbol reference in a modal beside the parameter heading. Gallery cards retain static images. Scenes use neutral backgrounds by default; textured sky and ground are optional.

The GitHub profile picture keeps its original colours, without a filter or
desaturation. The ENSICAEN logo has its own copy in the frontend assets;
it keeps its colours and a white backing for dark-mode readability.

## Interaction and copy

The theme follows the browser until a manual choice is saved. The sun/moon
button switches between light and dark. Palette colours interpolate over
500 ms with ease-in-out timing for manual, system or synchronized preference
changes. Rapid toggles reverse the colour transition smoothly; reduced motion
makes the change instant. Local hover, focus and transform transitions remain
independent. Language labels remain in FR / EN
order, with the current language distinguished and no flags.

Keep keyboard navigation, the skip link, visible focus, text alternatives
and reduced-motion support. The plant can be changed with the keyboard.

Copy is personal and direct, about coding for fun, games, AI and 3D rendering.
It should not read like a sales pitch. Headings and short leads have no
terminal full stop. The About lead is “Product & Software Engineer”.

The warm palette remains the default outside Eyefox, SpellWar and Booster Break, including the
full Guide. Their landscapes are decorative portfolio artwork. Eyefox's forest
is documented in `FOREST-MEDIA.md`; SpellWar's separate floating-platform scene
is documented in `SPELLWAR-MEDIA.md`. SpellWar's brighter daytime sky is an
interpretation of the game's dark spatial setting, not a captured game state.
Booster Break's arena is decorative pixel art; its original screenshots remain
unchanged. Its existing section layout, cover container dimensions, gaps, tags
and caption widths stay intact. Its cover and story images use the shared
8–14 px matte and subtle outline/shadow from Eyefox and SpellWar. The cover
frame follows the actual image bounds, with the arena visible around it.
The fixed scenery uses the same veil as Eyefox and SpellWar, without an
additional Booster tint; the prose uses the short caption shadow for contrast.
The real screenshots and gameplay video remain unchanged. Eyefox keeps its real
sprites, controls and readable grids in a translucent panel that blurs the scenery
behind it. Its tint follows the theme; grids and the difficulty selector stay opaque.
Browsers without backdrop-filter support retain an opaque panel. The full Guide conversation
uses the ordinary portfolio background without an enclosing panel; the compact
chat remains opaque. Story captures, grids and SpellWar's cover have
a light or dark matte matching the current theme, with a restrained shadow to
separate them from the scenery. Existing
companion animations and chat interactions are preserved.
Each landscape and its contrast veil stay fixed while content scrolls. The veil does not
change with the theme. The left side supports readable text while the right side
reveals the expanded open sky. The saved/system theme crossfades between aligned
day and dusk layers for Eyefox and SpellWar, and day and night layers for Booster
Break, over 900 ms. The interface palette and embedded puzzle
also follow the selected theme without resetting the puzzle, conversation or
draft. Reduced motion makes the scenery change instant.
Eyefox, SpellWar and Booster Break articles are transparent: no reading surface,
background box, border or content-level gradient. All three retain the shared project layout,
with technologies on the left and introductory text on the right, then story
headings on the left, prose on the right and captures underneath. The fixed
scenery veil and a restrained text shadow support white text in both themes.
The veil belongs to the environment and does not follow the article. Keep the
landscape visible behind headings, links and prose; the game panel and media mattes
retain their themed surfaces.

### Contrast and visual hierarchy references

- [W3C: Contrast (Minimum), WCAG 2.2 SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  sets a 4.5:1 minimum for normal text and 3:1 for large text. Check secondary
  labels, placeholders and text over the actual composited scenery, not only
  isolated colour tokens.
- [W3C: Non-text Contrast, WCAG 2.2 SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
  requires 3:1 against adjacent colours for visual information needed to identify
  controls and their states. Decorative separators do not all need the same
  emphasis; input boundaries and focus indicators do.
- [Nielsen Norman Group: 5 Principles of Visual Design in UX](https://www.nngroup.com/articles/principles-visual-design/)
  explains hierarchy through scale, spacing, placement and contrast. Here, a
  clear title, one primary action and readable media keep the landscape
  subordinate to the content. These references guide review; they
  are not a claim that the whole site has been audited for WCAG conformance.

Project notes, including Eyefox, use numbered sections, a heading beside a readable
prose column, and rows of real media underneath. When the content column is at
least 1200 px wide, story captures and videos use 88% of its width, centered.
Their column count, order and proportions stay unchanged. Smaller layouts,
interactive games, hero images, thumbnails and generative galleries keep their
existing sizing. Three related scientific figures use equal square frames,
preserving the complete
images and aligning the caption baselines. On narrow screens,
text and media use a single column. Figures have descriptive alternatives and
captions, and can be opened at their original resolution.

The SpellWar gameplay clip autoplays inline, muted and in a loop when it
approaches the viewport. Until then, `preload="none"` and an extracted poster
avoid downloading the video before it is needed. It contains no audio track.
Native controls remain available to pause or resume playback.

The About journey shares its section-title and body-text scale with the adjacent
interest section. Both use Jersey 10 for headings and Space Mono for paragraphs;
the journey's school/employer context remains a smaller secondary label.

Project thumbnails must work against light and dark surfaces without global
filters or blend modes. SpellWar uses the original game1.png gameplay capture
from its web branch. The Plants thumbnail is rendered directly by the shared
WebGL engine onto a transparent canvas, without a white matte. Preserve this
transparency when replacing it; the sprite's white pixels remain part of the
Eyefox artwork.

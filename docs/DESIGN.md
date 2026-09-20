# Visual design

Mathis approved the **Atlas × Signal** direction. The name uses an editorial
composition with Georgia and an italic surname. Project cards use Signal's
aligned grid, fine rules and sans-serif text.

## Colour and type

The palette is centralized in `packages/ui/src/styles/globals.css`:

- Light: background `#fffefc`, surface `#f8f7f4`, orange `#e99245`.
- Dark: background `#1b1b1b`, surface `#252525`, orange `#eaa566`.
- Orange buttons use dark text for readable contrast.
- Geist and Space Grotesk are served locally.

The public site uses this one direction. The comparison prototype is not
part of the maintained implementation.

## Layout

Desktop content occupies 90% of the viewport, capped at 2600 px. Do not put
percentage padding on the capped container: it reduces usable width as the
viewport grows. Mobile spacing remains separate.

Type and visuals scale up to 3840 px. Paragraphs keep a limited reading width
and the hero illustration remains proportionate to the text. The project
listing uses three columns above 1100 px, two on tablets and one on mobile.
Images use a 2:1 ratio with a maximum height of 360 px.

## Illustration and images

The home scene uses the original ABOP WebGL renderer through the shared L-system React package. Its compact controls switch presets and adjust the camera. The Plants detail page includes the full editor, with the symbol reference in a modal beside the parameter heading. Gallery cards retain static images. Scenes use neutral backgrounds by default; textured sky and ground are optional.

The GitHub profile picture keeps its original colours, without a filter or
desaturation. The ENSICAEN logo has its own copy in the frontend assets;
it keeps its colours and a white backing for dark-mode readability.

## Interaction and copy

The theme follows the browser until a manual choice is saved. The sun/moon
button switches between light and dark. Language labels remain in FR / EN
order, with the current language distinguished and no flags.

Keep keyboard navigation, the skip link, visible focus, text alternatives
and reduced-motion support. The plant can be changed with the keyboard.

Copy is personal and direct, about coding for fun, games, AI and 3D rendering.
It should not read like a sales pitch. Headings and short leads have no
terminal full stop. The About lead is “Product & Software Engineer”.

The approved palette and direction are the V1 baseline. Further small
visual refinements can follow the release.

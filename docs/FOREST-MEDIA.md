# Forest environment media

The daytime and dusk forest backgrounds were produced on 19 October 2026 with
Codex's built-in `image_gen` tool. No API key or fallback CLI was used.

The scene comes from the forest in the supplied Eyefox portfolio mockup. Its
interface and characters were removed first. The current pair extends that
cleaned scene upward to reveal more sky, then changes its daylight into a
clearly distinct violet and rose dusk. These generated decorations are separate
from the original Eyefox game's artwork; the live fox sprite remains separate.
The forest is used only on Eyefox. SpellWar's separate landscape is documented
in [SPELLWAR-MEDIA.md](SPELLWAR-MEDIA.md); both environments use
`web/src/project-world.css` for fixed scenery and theme transitions. The full
Guide retains the normal portfolio background.

## Reference and source files

The user supplied a 1586 × 992 Eyefox portfolio mockup that visually matched
the earlier generated design reference. Its landscape contains a slender ruined
tower and narrow waterfall to the right, a lake below, trees framing the sides,
and a rocky ledge at the right edge.

The 1586 × 992 mockup was cleaned by editing away the sidebar, title plaque,
copy, controls, puzzle grids, frames, and characters. Image generation
reconstructed the areas previously hidden by those elements. That cleaned
daytime PNG became the source for the current sky extension.

The current daytime edit requested approximately 25% additional canvas height
above that scene, with open cyan sky in the upper center and right. It asked for
1586 × 1240 pixels; the built-in tool supplied **1418 × 1109 pixels** at the
corresponding aspect ratio. The dusk edit preserved that output size.

The tower, narrow waterfall, lake, framing trees, and right-hand rocky ledge
were visually checked across the pair. The daytime image has bright cyan sky
and ivory clouds. The dusk image has violet and indigo sky, peach and rose cloud
edges, dimmer blue forest, and matching warm reflections in the lake. Both
images are free of UI, text, and characters. The paired composition is intended
for the page's day-to-dusk crossfade; the transition is implemented separately
in the page styles.

The reference and generated PNG originals are retained locally outside the
repository. The following portable names describe their roles in the generation
chain; they are not repository paths or literal local filenames.

| Portable reference  | Role                                             | Dimensions  |
| ------------------- | ------------------------------------------------ | ----------- |
| `mockup-reference`  | User-supplied Eyefox portfolio mockup            | 1586 × 992  |
| `cleaned-daylight`  | Mockup edited to remove interface and characters | 1586 × 992  |
| `expanded-daylight` | Daytime scene extended upward with more sky      | 1418 × 1109 |
| `dusk-variation`    | Lighting edit of `expanded-daylight`             | 1418 × 1109 |

## Runtime assets and encoding

The PNG originals were encoded with FFmpeg as lossless WebP derivatives using
`-c:v libwebp -lossless 1 -compression_level 6 -pix_fmt bgra`. No resize, crop,
blur, or color adjustment was applied during encoding. The website serves only
the WebP files; the original PNG files remain in local generation storage.

| Public asset                               | Dimensions  | File size       |
| ------------------------------------------ | ----------- | --------------- |
| `web/public/assets/world/forest-day.webp`  | 1418 × 1109 | 2,053,076 bytes |
| `web/public/assets/world/forest-dusk.webp` | 1418 × 1109 | 2,045,812 bytes |

For each variant, FFmpeg decoded the PNG and WebP to `rgb24` and computed the
same SHA-256 hash, verifying that the WebP conversion preserved the source RGB
pixels exactly:

| Variant | Decoded RGB SHA-256, identical for PNG and WebP                    |
| ------- | ------------------------------------------------------------------ |
| Daytime | `cb9d83273e9e80e568455499762f2de7bdb00033c99792402c06d8ef04d984b9` |
| Dusk    | `b330683f1d4b3fa1c88967ecbc8f9ea8bc7044b796c10b68867b56a1a110ea43` |

Any contrast treatment for overlaid text belongs to the page styles, not to
these source images.

## Exact generation prompts

### Daytime sky extension

Tool: built-in `image_gen`.

Input: the `cleaned-daylight` PNG, supplied through `referenced_image_paths`.
Output: `expanded-daylight`.

`transparent_background`: `false`.

Prompt, verbatim:

```text
Use case: precise-object-edit. Input image 1 is the exact edit target, a clean pixel-art forest landscape. OUTPAINT THE CANVAS UPWARD ONLY to show more sky. Keep the entire existing 1586 by 992 scene at its original scale and horizontal position, and add approximately 248 pixels of new image above it (about 25 percent extra height), targeting a 1586 by 1240 canvas. Do not crop, stretch, zoom, or redesign the existing landscape. Every existing tree trunk, ruined tower, waterfall, bank, rock, lake edge, and right-hand rocky ledge must keep its shape and its position relative to every other existing feature; the original scene simply sits below the newly extended sky. Continue the existing trees into the added top strip only at the far left and far right as a high framing canopy. Keep the upper center and upper right visibly OPEN so that sky occupies a substantially larger part of the composition; do not fill that opening with new trees or dense foliage. The new sky is unmistakable bright clear DAYLIGHT: luminous cyan and pale blue, natural soft ivory cloud shapes continuing the existing sky, no yellow/orange sunset cast. Retain the original blue/cyan atmospheric daylight and teal forest below, with crisp clean pixel art and unchanged clustered pixel edges. Keep the original slender ruined tower and narrow waterfall at the right exactly the same size and alignment; no new buildings, mountains, landscape landmarks, suns, moons, stars, birds, or other objects. No characters, foxes, people, animals, UI, text, labels, buttons, borders, frames, or watermark. Output one opaque landscape with more sky above the SAME existing decor. No blur or smoothing.
```

### Dusk lighting variation

Tool: built-in `image_gen`, editing the expanded daytime output.

Input: the `expanded-daylight` PNG, supplied through `referenced_image_paths`.
Output: `dusk-variation`.

`transparent_background`: `false`.

Prompt, verbatim:

```text
Use case: lighting-weather. Input image 1 is the EXACT EDIT TARGET: the expanded-sky daytime forest background, 1418 by 1109 pixels. Produce a clearly distinguishable DUSK version by changing ONLY lighting and color. Keep EXACTLY the same 1418 by 1109 canvas, camera, framing, scale, composition, silhouettes, and positions of every existing tree, branch, tower, waterfall, rock, lake edge, reflection shape, cloud shape, and right-hand ledge. This pair will be crossfaded in an animation, so all geometry and pixel clusters must align; no object may move or be redesigned. The expanded open sky must change unmistakably from daytime cyan to rich violet and indigo, with visible peach and rose sunset bands and warm pink edges on the SAME existing clouds. Create a pronounced but natural blue-hour/dusk atmosphere: substantially dimmer cool blue and indigo forest, muted cyan waterfall, subdued lake carrying restrained violet and rose reflections in its existing reflection pattern. The sky should visibly communicate sunset even at small display sizes; do not make a nearly identical blue daytime image. Preserve enough detail to read the existing landscape, without crushing it into black. Retain the same narrow ruined tower, waterfall alignment, lake, side-framing canopy, and empty right rocky ledge. No new sun, moon, stars, lanterns, fireflies, birds, mountains, buildings, clouds, characters, foxes, people, animals, or other objects. No UI, text, labels, frames, grids, buttons, or watermark. Preserve crisp pixel art, no blur, no smoothing, no grain. Output one opaque image with IDENTICAL dimensions and decor; only its illumination and palette change.
```

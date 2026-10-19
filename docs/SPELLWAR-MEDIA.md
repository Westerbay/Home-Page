# SpellWar media and content sources

## Selected screenshots

The still gallery uses genuine screenshots already published in the SpellWar
repository. The local source is the `SpellWar-web` checkout at `079bf67`
(branch `web`).

| Portfolio asset                                         | Original file      | Subject                                       |
| ------------------------------------------------------- | ------------------ | --------------------------------------------- |
| `web/public/assets/spellwar/engine-world.webp`          | `images/game2.png` | Third-person character and floating platforms |
| `web/public/assets/spellwar/platform-orientations.webp` | `images/game3.png` | Platforms with different orientations         |
| `web/public/assets/spellwar/generated-world.webp`       | `images/game4.png` | Platform arrangement, rocks and vegetation    |

[Original screenshots](https://github.com/Westerbay/SpellWar/tree/web/images).
All originals are 1920 × 1080. Pillow resized them to 1600 × 900 with Lanczos
and exported RGB WebP at quality 85, method 6. No crop, colour adjustment,
retouching or AI enhancement was applied.

## Project cover

`web/public/assets/spellwar/gameplay.webp` uses the existing project cover,
originally published as `images/game1.png` in the same SpellWar web branch.
The complete 1920 × 1080 frame is retained. On 18 October 2026, Pillow
re-encoded the portfolio PNG as WebP quality 90, method 6: 2,345,757 bytes
became 311,444 bytes. Dimensions and alpha are unchanged; the RGB encoding
is lossy and was visually checked at native resolution.

The original portfolio PNG is available at commit
`724ba2d4ca52337cb6afc5b1125e9b9af54efc73`. Reproduce with Python and Pillow:

```sh
python scripts/optimize-portfolio-media.py --source-ref 724ba2d4ca52337cb6afc5b1125e9b9af54efc73
```

This script also optimizes two PINNacle figures. The cover reference now
uses the WebP, and the unused PNG has been removed from public assets.

## Gameplay video

Mathis recorded and supplied the gameplay on 18 October 2026, and authorized
selecting and editing the best moments for the portfolio. The source file is:

```text
Screen recorder_10-18-2026_11-16-21-383.mp4
```

Source properties: 57.408 seconds, 1920 × 1080 at 60 fps, H.264 video and three
AAC audio tracks. Its SHA-256 is
`F18446A8C8864EC7ACD53665A3D7F3D73E7549D72B7195A0B8B6010BB9BB97BB`.
The original is unchanged and is not copied into the repository.

The portfolio clip is the continuous interval **00:35.000–00:43.300**.
It shows the character approaching an inclined platform, crossing to it
while the character and camera reorient, then continuing across other
platforms and landing. This is recorded gameplay, with no inserted animation,
interpolation, speed change or internal edit.

The selected interval contains only the fullscreen game. The desktop, loading
sequence and closing menu elsewhere in the source are excluded. No spatial
crop was necessary. The original Outplayed recording watermark remains visible.
All audio tracks were removed.

| Portfolio asset                                             | Properties                                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `web/public/assets/spellwar/gravity-transition.mp4`         | 8.300 seconds, 1280 × 720, 30 fps, H.264, yuv420p, no audio, MP4 faststart, 2,803,548 bytes |
| `web/public/assets/spellwar/gravity-transition-poster.webp` | Source frame at 00:43.000, 1280 × 720, WebP quality 85, 71,736 bytes                        |

The poster shows the character standing on a platform, with nearby surfaces,
plants and trees visible. It is a frame from the selected clip.

The page initially uses `preload="none"` so the 2.8 MB clip does not compete
with the project cover on mobile. A viewport observer enables muted autoplay
and buffering when the video comes within 160 px of the viewport. Once started,
playback continues with the same native controls and loop; the observer does
not pause or restart it when scrolling. Browsers without viewport observation
enable autoplay immediately. Without JavaScript, the source and native controls
remain available for manual playback.

Reproduction commands (PowerShell, from the portfolio root; `$source` is the
source file above):

```powershell
ffmpeg -ss 35 -i "$source" -t 8.3 -map 0:v:0 -an -vf "scale=1280:720:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart -map_metadata -1 "web/public/assets/spellwar/gravity-transition.mp4"
ffmpeg -ss 43 -i "$source" -vf "scale=1280:720:flags=lanczos" -frames:v 1 -c:v libwebp -quality 85 -compression_level 6 "web/public/assets/spellwar/gravity-transition-poster.webp"
```

Validation covered the selected frames, the exported contact sheet, the poster,
full decoding of the clip, stream metadata and the MP4 faststart layout. The
export has one video stream and no audio stream. Earlier test recordings made
while attempting automated control are not used in the portfolio.

## Technical claims

Content was checked against source commit
`e92325a3a96e2f38784941f15b8490cd39777ebc` on 18 October 2026:

- [README](https://github.com/Westerbay/SpellWar/blob/e92325a3a96e2f38784941f15b8490cd39777ebc/README.md): C++/OpenGL engine, third-person movement, multiple characters, and the separation between `wgame` and `spellwar`.
- [PlayerMotion.cpp](https://github.com/Westerbay/SpellWar/blob/e92325a3a96e2f38784941f15b8490cd39777ebc/src/spellwar/world/player/PlayerMotion.cpp): destination orientation, intermediate hitbox checks before platform transitions, and blocked movement on collision.
- [Collision.cpp](https://github.com/Westerbay/SpellWar/blob/e92325a3a96e2f38784941f15b8490cd39777ebc/src/wgame/geometry/Collision.cpp): eight-way recursive subdivision and collision rejection by region.
- [Map.cpp](https://github.com/Westerbay/SpellWar/blob/e92325a3a96e2f38784941f15b8490cd39777ebc/src/spellwar/world/map/Map.cpp): random platform position and size, overlap checks and some platform orientations towards the map centre.
- [Platform.cpp](https://github.com/Westerbay/SpellWar/blob/e92325a3a96e2f38784941f15b8490cd39777ebc/src/spellwar/world/map/Platform.cpp): decoration placement with collision checks, geometry transforms and instanced rendering.
- `shaders/modelDrawer.frag` in the supplied Windows v1.0 package: metallic/roughness material data, tangent-space normal mapping and Fresnel/Smith/GGX diffuse/specular lighting.

No named terrain-generation algorithm, universal gravity simulation, combat
system, performance metric or rendering benchmark is claimed. The terrain
description follows the inspected placement code. References to local gravity
describe the visible change of the character's reference frame during a platform
transition. The source shaders support the material claims; the media are
in-game views rather than a controlled comparison of rendering techniques.

The 3D models, textures, font and space background have their own authors.
The [repository asset credits](https://github.com/Westerbay/SpellWar#-asset-credits)
remain the source for those attributions. The portfolio describes the engine
and game implementation without implying authorship of third-party models.

## Decorative project environment

The SpellWar detail page uses a generated pixel-art environment inspired by the
real `generated-world.webp` and `platform-orientations.webp` screenshots above.
The existing Eyefox forest supplies a style reference only. Floating stone
platforms, violet spikes and red trees come from the game's visual vocabulary;
the daytime sky is a decorative extrapolation of its darker cosmic setting.
This artwork is not presented as a game screenshot. Original captures and video
remain unchanged.

Both variants were produced with Codex's built-in `image_gen` on 19 October 2026,
without an API key or fallback CLI. The dusk image edits the generated daytime
image, preserving platform, crystal, vegetation and cloud positions for the
same 900 ms day/dusk crossfade as Eyefox. The Guide has no scenery and keeps the
adventurer when entered from SpellWar.

The generated PNGs were encoded to WebP quality 90, method 6 with Pillow,
without cropping, resizing or retouching. Both outputs are 1672 × 941.

| Asset                                        |  Bytes | SHA-256                                                            |
| -------------------------------------------- | -----: | ------------------------------------------------------------------ |
| `web/public/assets/world/spellwar-day.webp`  | 363480 | `c428765266fca33ae599bd24a9bf297b2d404a10cc06ef8a4b94198d13529aa3` |
| `web/public/assets/world/spellwar-dusk.webp` | 325802 | `2db118bd03babc50d2e24d0ed2e0be9cc706eef0d2ef71afad931be1d7d5d1a7` |

### Daytime prompt

```text
Use case: stylized-concept. Asset type: decorative background illustration for the SpellWar portfolio page, with a matching twilight edit to follow. Input images: image1 and image2 are actual SpellWar screenshots, SUBJECT REFERENCES ONLY. Image3 is the existing Eyefox website background, STYLE reference ONLY: match its intentional crisp pixel-art rendering, layered atmosphere and quality, do NOT copy its forest/lake/castle scene. Create a wide 16:9 panoramic pixel-art landscape inspired faithfully by SpellWar: square fractured charcoal-grey stone platforms floating in open air, several platforms tilted or upside-down with their own contradictory gravity, long clusters of angular amethyst-purple spikes on their undersides, small vivid red-leaf trees and magenta alien plants rooted to those platforms. No character, dragon, fox, HUD, text, weapons, logo, watermark, frames or panels. Clearly daytime, open luminous pale-blue and lavender sky with soft clouds and warm daylight on stone edges; sky must occupy the upper half and central area so a later twilight variation is visibly distinct. Depth from distant faint floating platforms. Compose for a website with a left navigation rail and centered content: low-detail calm shaded space through the left and middle, spectacular foreground rocky platform/crystals at the lower right, floating islands at upper right and left edges. Avoid covering all sky with platforms. Pixel art with deliberate square pixels, restrained dithering, rich but coherent stone-grey, purple, scarlet and sky-blue palette, no photorealism, no blurred/painterly treatment. A decorative reinterpretation, not a fake gameplay screenshot. Landscape full bleed with no UI.
```

### Twilight edit prompt

```text
Use case: lighting-weather. Asset type: matching twilight background for the SpellWar website. Edit target: the attached approved daytime floating-platform pixel-art landscape. Change ONLY time of day, illumination and sky colors. Preserve the EXACT composition, camera, dimensions, every platform silhouette and position, stone cracks, every purple crystal cluster, red tree, vegetation patch and cloud silhouette. The two images will be crossfaded in-place, so no objects may shift or be added/removed. Replace daylight with a strongly distinct cosmic twilight: deep indigo and violet sky, muted magenta/rose light along the EXISTING cloud edges, a sparse delicate starfield in existing clear sky, purple crystals softly lit, grey stone faces in subdued slate/indigo shadow and red trees still identifiable. Keep the daytime scene's pixel texture and deliberate crisp pixels unchanged. This is dusk, not an all-black filter: preserve readable silhouettes, atmospheric depth and subtle warm rim light on the stone. No sun, moon or new large object. No characters, text, UI, watermark, borders or glow effects over the whole image. Landscape 16:9, identical size and framing to the input.
```

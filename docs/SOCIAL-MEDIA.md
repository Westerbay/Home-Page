# Social preview images

## General pages

Home, Projects, About, Contact and the Assistant use the same illustration as
the favicon, from its 450 × 450 original `assets/avatar.png`. Open Graph declares
its PNG type and actual dimensions; Twitter uses a square `summary` card. French
and English pages share the image and provide localized avatar alternative text.
The unused `social/default.jpg` variants have been removed.

## Project preview compositions

The twelve `web/public/assets/social/**/*.jpg` images are 1200 × 630 JPEGs,
rendered at quality 90 by `scripts/generate-social-previews.mjs`.
Each project uses a dominant authentic visual without added titles, descriptions,
branding or borders. The link preview already supplies the localized page title
and description outside the image.

French previews retain `assets/social/{slug}.jpg`; English previews retain
`assets/social/en/{slug}.jpg`. Both versions are byte-identical because no
localized text is baked into the composition.

| Preview                  | Visual source                             | Composition                                                      |
| ------------------------ | ----------------------------------------- | ---------------------------------------------------------------- |
| `booster-break.jpg`      | `booster-break/foil.webp`                 | Foil card reveal, full frame                                     |
| `spellwar.jpg`           | `spellwar/gravity-transition-poster.webp` | Contained gameplay capture, preserving the source watermark      |
| `plants.jpg`             | `plants-render.png`                       | Enlarged tree on warm white, cropping transparent canvas margins |
| `eyefox.jpg`             | `eyefox/android-game.webp`                | Contained game screen with both grids                            |
| `pinnacle.jpg`           | `pinnacle/regions-relu.webp`              | Contained activation-region figure on dark gray                  |
| `stylegan-cheap-dit.jpg` | Four `dit-epoch-200/230` samples          | Four equal-width cropped panels of saved diffusion outputs       |

The four diffusion files are `dit-epoch-200-01.webp`, `dit-epoch-200-03.webp`,
`dit-epoch-230-01.webp` and `dit-epoch-230-07.webp`. No new model outputs or
scientific figures are generated. Source colours and original media remain
unchanged. Project media documents describe provenance and attribution.

Reproduce from the repository root with the existing dependencies and Playwright
Chromium installed:

```sh
node scripts/generate-social-previews.mjs --output-dir .cache/social-preview-cleanup
```

The output option uses Node's native argument parser and resolves paths from the
repository root. Omitting it deliberately replaces the public project previews.
CI uses the cache-only invocation. The generator embeds local images as data URLs,
makes no network requests, waits for every image to decode, renders six JPEGs in
Chromium, verifies their decoded dimensions and copies them to the English paths.
All six public compositions were visually inspected after generation.

## Shared delivery images

`scripts/optimize-portfolio-media.py` also derives these WebP variants from
the existing PNGs, with Pillow, method 6. The two small variants use Lanczos
resampling within a 128 × 128 box; there is no crop or retouching. Full-size
images retain their native dimensions and alpha. Small-image alpha matches
the resized source. The original PNGs remain available for source provenance
and, for Plants, the social preview generator.

| Source              | Delivery asset       | Dimensions | Quality |        Before |         After |
| ------------------- | -------------------- | ---------- | ------: | ------------: | ------------: |
| `avatar.png`        | `avatar.webp`        | 450 × 450  |      90 | 253,619 bytes |  29,428 bytes |
| `avatar.png`        | `avatar-128.webp`    | 128 × 128  |      90 | 253,619 bytes |   6,744 bytes |
| `ensicaen.png`      | `ensicaen.webp`      | 128 × 124  |      95 |  42,821 bytes |   8,164 bytes |
| `plants-render.png` | `plants-render.webp` | 1200 × 900 |      95 | 352,880 bytes | 131,460 bytes |

The header and favicon use the small avatar; About uses the full-size WebP.
The school mention and journey use the small ENSICAEN logo. Plants cards
use the responsive variants described in RESPONSIVE-MEDIA.md; the scene
placeholder uses the full-size Plants WebP. Visual checks cover
the small portrait, logo and fine branches against their original PNGs.

Reproduction (Python with Pillow, from the repository root):

```sh
python scripts/optimize-portfolio-media.py --source-ref 724ba2d4ca52337cb6afc5b1125e9b9af54efc73
```

The same script also re-encodes the SpellWar cover and two PINNacle figures;
see their media documents for the original sources and individual settings.

## Companion sprite delivery

The four existing companion atlases and speech strips are also delivered as
WebP. These conversions are strictly lossless: decoded RGBA bytes, including
the RGB values beneath zero alpha, match their original PNGs exactly. Every
sheet remains 1774 × 887. No resizing, palette change or regeneration was
performed. The PNG originals and their original generation provenance remain
in `web/public/assets/companion/provenance.json`; its `deliveryEncoding` section
records the conversion settings and decoded-pixel SHA-256 values.

| Sprite             |  Original PNG | Lossless WebP |
| ------------------ | ------------: | ------------: |
| `adventurer-atlas` | 991,343 bytes | 747,218 bytes |
| `adventurer-talk`  | 723,005 bytes | 523,930 bytes |
| `fox-atlas`        | 517,315 bytes | 375,536 bytes |
| `fox-talk`         | 347,156 bytes | 204,414 bytes |

Pillow settings are `lossless=True, exact=True, quality=100, method=6`.
`quality` controls encoding effort in lossless mode, not pixel quality.
The script rejects any decoded RGBA or dimension difference:

```sh
python scripts/optimize-portfolio-media.py --source-ref 724ba2d4ca52337cb6afc5b1125e9b9af54efc73 --companion-only
```

The full Guide page and floating companions in desktop viewports at least
1101 px wide and 651 px high use these native sheets. Other floating companions
use density-specific copies with 96, 192 or 288 px per frame (1×, 2×, 3×).
These copies are Lanczos downscales of the original PNGs, encoded losslessly
after resampling. They preserve the complete canvas, frame layout and alpha;
they are not pixel-identical to the full-resolution sources. The encoder verifies
that decoded RGBA bytes match the resized intermediate exactly.

| Compact character | 1×, atlas + talk | 2×, atlas + talk | 3×, atlas + talk |
| ----------------- | ---------------: | ---------------: | ---------------: |
| Adventurer        |     68,746 bytes |    218,652 bytes |    432,250 bytes |
| Fox               |     42,118 bytes |    121,942 bytes |    231,004 bytes |

```sh
python scripts/optimize-portfolio-media.py --source-ref 724ba2d4ca52337cb6afc5b1125e9b9af54efc73 --compact-companion-only
```

`GuideCompanion` gives the browser CSS resolution variants and preload
`imagesrcset` candidates, so it downloads the appropriate density instead of
the native sheets for small floating characters. Both animation sheets still
preload at low priority, including speech before the first answer. Expanding
uses native artwork; minimizing selects native or density-sized artwork for the
current viewport. CSS canvas sizes and the mobile layout are documented in
DESIGN.md. This delivery selection preserves the atlas frame layout, animation
timing and companion state logic.

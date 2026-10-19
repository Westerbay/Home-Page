# Social preview images

The fourteen `web/public/assets/social/**/*.jpg` images are 1200 × 630 JPEGs,
rendered at quality 90 by `scripts/generate-social-previews.mjs` on
18 October 2026. These committed, validated previews retain the typography used
at generation time: Geist and Space Grotesk, with warm white (`#fffefc`) and
orange (`#e99245`). The generator maintenance described below does not replace
these JPEGs or change the website layout. The sizes in this document describe
the committed images, not a new generation with the current fonts.

French previews use `assets/social/{slug}.jpg`; English previews use
`assets/social/en/{slug}.jpg`. Project screenshots remain authentic in both
languages, while the surrounding title, description and category are localized.

| Preview                  | Existing visual source                 |  Output size |
| ------------------------ | -------------------------------------- | -----------: |
| `default.jpg`            | `assets/plants-render.png`             | 66,039 bytes |
| `booster-break.jpg`      | `assets/booster-break/packs.webp`      | 76,120 bytes |
| `spellwar.jpg`           | `assets/spellwar/engine-world.webp`    | 72,048 bytes |
| `plants.jpg`             | `assets/plants-render.png`             | 66,869 bytes |
| `eyefox.jpg`             | `assets/eyefox/android-game.webp`      | 82,529 bytes |
| `pinnacle.jpg`           | `assets/pinnacle/cover.webp`           | 77,581 bytes |
| `stylegan-cheap-dit.jpg` | `assets/stylegan-cheap-dit/cover.webp` | 95,009 bytes |

English output sizes, in the same order: 66,504, 75,676, 72,917, 65,706,
80,946, 77,482 and 93,071 bytes. They use the same source images and composition.

All visuals come from the projects. The complete source image is contained
inside its frame without cropping, colour adjustment or retouching. The
StyleGAN preview contains actual model outputs from that project; no new
AI imagery was generated for these compositions. Project-specific media
documents describe the original captures, figures and attribution.

The maintained generator uses the installed Jersey 10 and Space Mono regular
faces, matching the current portfolio fonts. It keeps the same composition,
colours and project imagery; its output is not a byte-for-byte reproduction of
the earlier JPEGs. No retired font dependency is required.

Validate a new generation from the repository root after installing the existing
workspace dependencies and the Playwright Chromium browser:

```sh
node scripts/generate-social-previews.mjs --output-dir .cache/social-preview-cleanup
```

The option uses Node's native argument parser and resolves relative directories
from the repository root. Without `--output-dir`, the destination remains
`web/public/assets/social`; use that default only when deliberately replacing
the public previews. CI runs the cache-only command after installing Chromium.

The generator renders HTML/CSS in headless Chromium. It embeds local images
and bundled fonts as data URLs, checks that both font faces loaded, waits for
images to decode, and rejects overflowing text, content outside the page padding
or overlapping composition regions. Each saved JPEG is decoded to verify its
1200 × 630 dimensions. It makes no network requests. All fourteen French and
English outputs from the maintained generator were also visually inspected in
the cache directory. Chromium/font versions may slightly affect JPEG bytes.

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

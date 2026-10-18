# Social preview images

The fourteen `web/public/assets/social/**/*.jpg` images are 1200 × 630 JPEGs,
rendered at quality 90 by `scripts/generate-social-previews.mjs` on
18 October 2026. Their typography and colours use the portfolio's existing
Geist, Space Grotesk, warm white (`#fffefc`) and orange (`#e99245`).
They do not change the website layout.

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

Reproduce from the repository root after installing the existing workspace
dependencies and the Playwright Chromium browser:

```sh
node scripts/generate-social-previews.mjs
```

The generator renders HTML/CSS in headless Chromium. It embeds local images
and bundled fonts as data URLs, waits for fonts and images to decode, and
rejects horizontally overflowing text before writing each JPEG. It makes
no network requests. All fourteen outputs were visually inspected and their
dimensions checked. Chromium/font versions may slightly affect JPEG bytes.

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
and the scene placeholder use the full-size Plants WebP. Visual checks cover
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

`GuideCompanion` selects the corresponding WebP URLs. Both sheets retain their
existing preload behavior with low fetch priority so content images take
precedence. Sprite dimensions, CSS frame steps, timing and state logic are unchanged.

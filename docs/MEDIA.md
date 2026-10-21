# Media sources and reproduction

Public files live in web/public/assets; paths below are relative to that directory.
Keep genuine screenshots, scientific figures and model outputs distinct from
AI-generated decorative artwork. Preserve source proportions, alpha, captions,
watermarks and scientific labels. Regeneration should not retouch the underlying work.

## Attribution and reuse

Project code licenses do not automatically license third-party artwork. Individual
artwork licenses are incomplete here; follow creators' terms before independent reuse.

- Eyefox artwork: [Monogram by datagoblin](https://datagoblin.itch.io/monogram),
  [Pixel Fantasy Caves by Szadi art](https://szadiart.itch.io/pixel-fantasy-caves),
  [GUI elements by Mounir Tohami](https://mounirtohami.itch.io/pixel-art-gui-elements),
  and [fox sprites by Elthen](https://elthen.itch.io/2d-pixel-art-fox-sprites).
  Its [web-component notices](https://github.com/Westerbay/Eyefox-Puzzle/blob/web/THIRD_PARTY_NOTICES.md)
  distinguish GPL project code from the creators' artwork terms.
- SpellWar models, textures, font and space background have separate creators;
  retain the upstream [asset credits](https://github.com/Westerbay/SpellWar#asset-credits)
  and [source notices](https://github.com/Westerbay/SpellWar/blob/main/assets/sources.md).
- Booster Break is an [unofficial fan-made app](https://github.com/Westerbay/Booster-Break#license-and-disclaimer).
  Pokémon names, card illustrations and pack artwork belong to their respective
  owners; the application's MIT code license does not cover those assets.
- PINNacle figures are credited to Araby Doucouré, Mathis Dubuisson, Johann Ly and
  Valentin Salic. A separate redistribution license for the supplied defense PDF
  is not recorded. Training-reference image rights for StyleGAN & Cheap DiT are
  likewise not established by the model repository's code license.
- Identity marks come from [Galadrim](https://galadrim.fr/), the existing ENSICAEN
  asset and [UNICAEN's identity resources](https://www.unicaen.fr/universite/decouvrir/logo-unicaen-usages/).
  Preserve their colours and proportions. No separate license is recorded for
  the supplied avatar or the AI-generated portfolio decorations below.

## Project captures

### Eyefox Puzzle

The [original Android screenshots](https://github.com/Westerbay/Eyefox-Puzzle/tree/main/screenshots) are separate from the browser demo and decorative forest.

| Asset                    | Source                         | Native dimensions |
| ------------------------ | ------------------------------ | ----------------- |
| eyefox/android-game.webp | screenshots/game_land.jpg      | 2302 × 1080       |
| eyefox/android-menu.webp | screenshots/maintitle_land.jpg | 2311 × 1080       |

Both use Pillow RGB WebP, quality 90, method 6, without cropping or resizing.

### SpellWar

Sources are genuine [screenshots in the upstream web branch](https://github.com/Westerbay/SpellWar/tree/web/images).

| Asset                               | Source           | Delivery                     |
| ----------------------------------- | ---------------- | ---------------------------- |
| spellwar/gameplay.webp              | images/game1.png | 1920 × 1080, WebP quality 90 |
| spellwar/engine-world.webp          | images/game2.png | 1600 × 900, WebP quality 85  |
| spellwar/platform-orientations.webp | images/game3.png | 1600 × 900, WebP quality 85  |
| spellwar/generated-world.webp       | images/game4.png | 1600 × 900, WebP quality 85  |

The three gallery sources use Lanczos downscaling and Pillow method 6, without
cropping, colour adjustment or AI enhancement. Mathis supplied the gameplay recording.
gravity-transition.mp4 keeps the continuous 35.0–43.3 second interval without speed
changes, at 1280 × 720 / 30 fps with no audio and its Outplayed watermark retained.
The poster is frame 43.0 seconds. With the original recording available:

    ffmpeg -ss 35 -i /path/to/gameplay.mp4 -t 8.3 -map 0:v:0 -an -vf "scale=1280:720:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart -map_metadata -1 web/public/assets/spellwar/gravity-transition.mp4
    ffmpeg -ss 43 -i /path/to/gameplay.mp4 -vf "scale=1280:720:flags=lanczos" -frames:v 1 -c:v libwebp -quality 85 -compression_level 6 web/public/assets/spellwar/gravity-transition-poster.webp

The source recording is not distributed in this repository.

### Booster Break

Anonymous French/dark-theme captures of [the public app](https://booster.mathis-db.com/)
use 1280 × 720 RGB WebP, Pillow quality 87, method 6, without resizing.

| Asset                        | Public view                                               |
| ---------------------------- | --------------------------------------------------------- |
| booster-break/packs.webp     | Boosters, with Nuit Noire selected                        |
| booster-break/catalogue.webp | Nuit Noire expansion preview, grouped by rarity           |
| booster-break/recap.webp     | Ten-card Tempête Argentée sandbox result                  |
| booster-break/foil.webp      | Zygarde reverse-holographic reveal from that sandbox draw |

The sandbox is visual only and does not add cards to a collection. Its random
draw cannot reproduce identical cards. Keep account data and personal collections
out of replacement captures. The generated arena is separate artwork.

### The Algorithmic Beauty of Plants

The [upstream renderer](https://github.com/Westerbay/The-Algorithmic-Beauty-of-Plants)
produced the 1200 × 800 captures in plants/ with its light theme, original palettes,
default camera/lighting and native labels. Presets: plant (4 generations, 22.5°),
tree (7, 22.5°), flower (5, 22.5°), hilbert (4, 90°). Encode PNGs as WebP quality 90.
Serve the standalone explorer or portfolio's Plants page, then run:

    node scripts/capture-plants-gallery.mjs http://127.0.0.1:4180/ /path/to/captures

The [script](../scripts/capture-plants-gallery.mjs) selects presets and waits for rendered frames.

### PINNacle

Sources are the 40-page group defense, _Représentations géométriques dans les
Physics Informed Neural Networks (PINNs)_, and the [setup branch](https://github.com/HadrienNU/PINNacle/tree/setup).
The project description also covers the electromagnetic experiments in
[projets3A](https://github.com/HadrienNU/PINNacle/tree/projets3A), which are
included in the history of setup. The experimental framework supports MLP/KAN
models and Deep Ritz; the activation extraction and C++/OpenGL viewer are in
setup. The figures below illustrate activation analysis, not a verified comparison
of those electromagnetic benchmarks. Public captions explain the figures;
their source locations remain documented here.

The PDF is not distributed here. Source SHA-256:
3c5038af590befe0bca06809b8bbec4176ca642244769f648184bbda15bd6266.

| Asset in pinnacle/         | Slide / embedded image | Dimensions  | WebP delivery |
| -------------------------- | ---------------------- | ----------- | ------------- |
| cover.webp                 | 30 / Image66.jpg       | 1920 × 1080 | Quality 95    |
| activation-extraction.webp | 11 / rendered diagram  | 1840 × 910  | Lossless      |
| regions-relu.webp          | 32 / Image68.jp2       | 832 × 816   | Quality 95    |
| regions-tanh.webp          | 33 / Image70.jp2       | 1400 × 1400 | Quality 92    |
| regions-silu.webp          | 34 / Image71.jp2       | 919 × 862   | Quality 95    |
| density-tanh.webp          | 24 / Image56.jp2       | 2048 × 1014 | Quality 98    |

Extract named images with pypdf's pages[slide - 1].images and save their image
objects with Pillow method 6, retaining alpha. Render slide 11 with
pdftoppm -f 11 -l 11 -r 200 -png /path/to/PINNacle.pdf detail, then crop
detail-11.png to (60, 180, 1900, 1090). Preserve axes, titles and colour scales.
The cover is a still frame with no verified epoch/activation assignment. The
ReLU diagram is explanatory; tanh/SiLU partitions are empirical. Differing density
colour scales do not demonstrate accuracy gains or a controlled model comparison.

### StyleGAN & Cheap DiT

The [model repository](https://github.com/Westerbay/StyleGan-and-Cheap-DiT/tree/855cd736024bb065349f4da637240986cd0e7ed2)
provides diffusion epoch-200/230 grids, GAN epoch-400 outputs and the epoch-20 VAE
reference/reconstruction grid. Assets in stylegan-cheap-dit/ preserve native
256 × 256 samples as lossless WebP without enhancement. Extract torchvision grid
cells at x = 2 + column × 258, y = 2 + row × 258, with a 256 × 256 crop.
GAN comparisons use zero-based positions 0, 1, 2, 8, 14, 11; VAE comparisons use
columns 0 and 6 from both rows. Keep reference images distinct from reconstructions.
The gallery contains eight epoch-200 outputs, seven epoch-230 outputs and one
seeded inference output. It is curated illustration, not a quality benchmark.

[generation.json](../web/public/assets/stylegan-cheap-dit/generation.json) records
the checkpoint, seed, source revision and container digest. The maintained
[inference helper](../scripts/generate-dit-gallery.py) captures steps 1, 200, 400,
600, 800 and 1000 without training or changing weights. Run from the repo root:

    mkdir -p /path/to/generated
    docker run --rm --network none --gpus all --cpus 6 --memory 6g \
      -e PYTHONPATH=/app/stylegan-and-cheap-dit \
      -v "$(pwd):/portfolio:ro" -v /path/to/generated:/output \
      --entrypoint python \
      ghcr.io/westerbay/stylegan-and-cheap-dit@sha256:a57fe3924e46c7d24f145f1dfd7bae93e723d27d5c4eeb2a7a2bbd3631c7e87a \
      /portfolio/scripts/generate-dit-gallery.py --seed 20261020 --count 1

Remove --gpus all for CPU inference. Increasing --count uses consecutive seeds;
only the first gets intermediate frames. Convert selected PNGs to lossless WebP
and keep their metadata. Exact pixels may vary with hardware/PyTorch versions.

## AI-generated decorations

These assets were generated/edited with OpenAI's image generation tool in Codex.
They are portfolio illustrations, not game captures or scientific outputs. Source
mockups/originals are not distributed; these descriptions cannot ensure identical regeneration.

| Asset                                                  | Dimensions  | Source and treatment                                                                                                                                    |
| ------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| world/forest-day.webp, forest-dusk.webp                | 1418 × 1109 | Eyefox portfolio mockup with UI/characters removed; sky extended; cyan day then violet/rose dusk; FFmpeg lossless WebP                                  |
| world/spellwar-day.webp, spellwar-dusk.webp            | 1672 × 941  | Real game screenshots as subject references; forest as pixel-art style reference; floating slabs, purple spikes, red trees; Pillow quality 90, method 6 |
| world/booster-break-day.webp, booster-break-night.webp | 1672 × 941  | Arena architecture inspired by the real app; blue/ivory daylight then midnight blue with amber lighting; FFmpeg quality 90, YUV420P                     |
| navigation/book-page.webp                              | 724 × 2172  | Opaque white/grey paper, left binding crease and fine right page edges; Pillow quality 85, method 6                                                     |
| about/grand-piano.webp                                 | 1254 × 1254 | Wooden grand piano in coloured pencil/pastel, with a small drawn shadow and transparent background; FFmpeg quality 92, BGRA                             |
| companion/_-atlas.webp, _-talk.webp                    | 1774 × 887  | Generated adventurer/fox identities and animation poses; exact lossless WebP                                                                            |

Generate daylight first, then edit lighting for the dark variant, preserving camera,
canvas, silhouettes and positions for crossfades. Exclude text, UI and characters.
SpellWar's daylight and Booster's open-sky architecture are decorative interpretations.
Contrast veils belong to CSS. Retain the piano's complete canvas, transparent gaps
and drawn shadow, without an opaque backdrop.

For lossless scenery use FFmpeg -c:v libwebp -lossless 1 -compression_level 6
-pix_fmt bgra. For lossy decorations use -q:v 90 (92 for the piano) and the
pixel format above. Preserve dimensions; alpha must survive transparent exports.
The navigation's binding crease is hidden by CSS framing, not an edited source.

## Delivery variants and shared assets

- [generate-responsive-project-images.py](../scripts/generate-responsive-project-images.py)
  derives 480/800/1280 px WebP candidates and project-images.json, without
  upscaling or cropping. It uses Lanczos, quality 92, method 6, and checks alpha.
- [generate-social-previews.mjs](../scripts/generate-social-previews.mjs) creates
  six 1200 × 630 JPEGs at quality 90, copied to equivalent English paths. It uses
  local authentic sources only: Booster foil, SpellWar poster, Plants render,
  Eyefox Android screen, PINNacle ReLU figure and four saved DiT outputs.
  Plants' transparent margins and DiT panels are cropped; Booster fills the frame.
  SpellWar, Eyefox and PINNacle are contained. No text is baked into previews.
- home/pinnacle.webp (600 × 338) and home/stylegan-cheap-dit.webp (600 × 301)
  are complete-cover Lanczos thumbnails, Pillow quality 88, method 6.
- avatar.png (450 × 450) supplies general social previews; avatar-128.webp is
  the favicon. ENSICAEN and Plants WebP delivery copies preserve their originals.
- [companion/provenance.json](../web/public/assets/companion/provenance.json)
  records AI origin, atlas layout and encodings. Atlases use 4 × 2 cells; talk
  strips use 2 × 1. Native WebPs preserve decoded RGBA, including hidden RGB.
  Compact 1×/2×/3× files use 96/192/288 px per frame, Lanczos downscaling and
  lossless exact encoding; they are not pixel-identical to the native originals.

Run from the root with Python/Pillow, project dependencies and Playwright Chromium.
Omitting the social output option replaces public previews. The optimization source
revision contains the originals retained in Git history.

    python scripts/generate-responsive-project-images.py
    node scripts/generate-social-previews.mjs --output-dir /path/to/social-previews
    python scripts/optimize-portfolio-media.py --source-ref 724ba2d4ca52337cb6afc5b1125e9b9af54efc73

The [optimizer](../scripts/optimize-portfolio-media.py) also accepts
--source-directory /path/to/original-assets, whose layout mirrors the assets
directory. Add --companion-only or --compact-companion-only to limit output.
Companion encoding uses Pillow lossless=True, exact=True, quality=100, method=6;
after resampling, decoded RGBA must match the resized intermediate exactly.

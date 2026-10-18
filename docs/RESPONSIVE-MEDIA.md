# Responsive project media

Project cards and detail covers retain the existing images, dimensions,
framing, hover transitions and colours. `ProjectVisual` now offers smaller
WebP candidates through `srcset`, allowing the browser to choose an image
for the rendered width and display pixel density. The original delivery
image is always the largest candidate and the fallback `src`.

The homepage and catalogue pass separate `sizes` values matching their
existing grid breakpoints, gaps, mobile gutters and 2600 px container cap.
Detail covers use the full container width. The first visible catalogue card
loads eagerly with high fetch priority; other cards remain lazy. Detail
covers retain their existing eager, high-priority loading.

PINNacle and SpellWar story illustrations use the same generated manifest and
source-set helper. Their `sizes` values follow the existing one-, two- and
three-column grids, with a single column below 800 px. Images remain lazy,
and their links still open the complete native source. The scientific figures,
captions, alignment and all original image dimensions remain unchanged.

## Sources and reproduction

Run from the repository root with Python and Pillow:

```sh
python scripts/generate-responsive-project-images.py
```

The script reads the existing full-size delivery assets. Plants uses its
original `plants-render.png` to preserve the source transparency without
another full-size lossy encoding. It downsizes with Lanczos and encodes
WebP at quality 92, method 6. It never upscales or crops an image and checks
dimensions and decoded alpha against each resized source. The generated
`project-images.json` records candidate URLs and intrinsic dimensions; it
is keyed by source path so the separate SpellWar homepage poster retains
its correct image at every size. URLs use the existing deployment-base helper.

The native sources are retained. No AI generation, retouching, recolouring
or changes to scientific content are involved. Original provenance remains
in the project media documents.

| Source                     | Native size |    480 px |    800 px |      1280 px |
| -------------------------- | ----------: | --------: | --------: | -----------: |
| Booster Break packs        |    85,364 B |  25,808 B |  55,150 B |     Original |
| SpellWar gameplay          |   311,444 B |  30,888 B |  77,150 B |    167,500 B |
| SpellWar homepage poster   |    71,736 B |  25,438 B |  56,006 B |     Original |
| PINNacle cover             |   385,124 B |  25,662 B |  67,622 B |    160,090 B |
| StyleGAN & Cheap DiT cover |   482,960 B |  33,702 B |  59,916 B | Not upscaled |
| Plants                     |   131,460 B |  52,746 B | 115,144 B | Not upscaled |
| Eyefox                     |    28,478 B |  13,194 B |  20,098 B | Not upscaled |
| SpellWar engine world      |   124,068 B |  24,372 B |  58,162 B |    115,046 B |
| SpellWar orientations      |   133,348 B |  27,136 B |  64,446 B |    126,974 B |
| SpellWar generated world   |   198,684 B |  38,448 B |  92,114 B |    192,536 B |
| PINNacle extraction        |   367,250 B |  18,702 B |  37,220 B |     67,644 B |
| PINNacle ReLU regions      |   318,072 B | 102,966 B | 258,042 B | Not upscaled |
| PINNacle tanh regions      |   748,660 B | 120,700 B | 284,772 B |    631,206 B |
| PINNacle SiLU regions      |   424,916 B | 113,290 B | 283,452 B | Not upscaled |
| PINNacle density           |   540,790 B |  38,236 B |  87,220 B |    184,334 B |

The largest reductions come from the detailed SpellWar and PINNacle
screenshots and the StyleGAN cover. High-density mobile displays can still
select 1280 px or the native image when needed. The browser remains in
control of this choice; smaller viewport width alone does not imply a
particular file will always be downloaded.

# PINNacle media and content

The project page uses genuine figures from the group defense supplied by
Mathis, `PINNacle.pdf` (40 pages), titled _Représentations géométriques dans
les Physics Informed Neural Networks (PINNs)_. The title slide credits
Araby Doucouré, Mathis Dubuisson, Johann Ly and Valentin Salic. The source
PDF remains outside the repository. Page numbers below are one-based and
match the printed slide numbers.

Source SHA-256:
`3c5038af590befe0bca06809b8bbec4176ca642244769f648184bbda15bd6266`.

## Assets

| Public asset                                 | Source                                | Dimensions  | Treatment                                                                    |
| -------------------------------------------- | ------------------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `assets/pinnacle/cover.webp`                 | Slide 30, `Image66.jpg`               | 1920 × 1080 | Original embedded frame, WebP quality 95                                     |
| `assets/pinnacle/activation-extraction.webp` | Slide 11, complete explanatory figure | 1840 × 910  | Poppler render at 200 dpi, cropped to `(60, 180, 1900, 1090)`, lossless WebP |
| `assets/pinnacle/regions-relu.webp`          | Slide 32, `Image68.jp2`               | 832 × 816   | Original embedded figure with alpha, WebP quality 95                         |
| `assets/pinnacle/regions-tanh.webp`          | Slide 33, `Image70.jp2`               | 1400 × 1400 | Original embedded figure with alpha, delivery WebP quality 92                |
| `assets/pinnacle/regions-silu.webp`          | Slide 34, `Image71.jp2`               | 919 × 862   | Original embedded figure with alpha, WebP quality 95                         |
| `assets/pinnacle/density-tanh.webp`          | Slide 24, `Image56.jp2`               | 2048 × 1014 | Original embedded pair of plots with alpha, delivery WebP quality 98         |

All embedded images retain their native dimensions. No AI generation,
enhancement, recoloring or reconstructed scientific results are used. The
ReLU extraction diagram is explicitly explanatory; the three circular
activation figures and density plots are results presented by the group.
The circular masks are preserved; decorative slide shadows and surrounding
slide text are not copied into the extracted images. Titles and color scales
in the density figure remain intact. The six assets total approximately 2.8 MB.

The source slides and final extracted images were visually inspected. The
cover comes from the slide titled “Animation sur 20 000 époques”; the PDF
only supplies a still frame. It does not establish which epoch or activation
function that frame represents, so the public caption does not assign one.
The browser displays it as a static image, not a playable animation.

## Reproduction

Use Poppler to render page 11, then crop the explanatory figure without the
slide header, footer or number:

```sh
pdftoppm -f 11 -l 11 -r 200 -png PINNacle.pdf detail
```

Using Python with `pypdf` and Pillow, extract the named page images through
`PdfReader(...).pages[page_number - 1].images`. Read each image's `.image`
property and save it with the filename and encoding in the table. For the
diagram use `Image.open("detail-11.png").crop((60, 180, 1900, 1090))`.
Save all WebP assets with `method=6`, preserving source alpha. WebP quality
95 was used for the large colored region captures; the explanatory diagram
and quantitative plots were initially encoded with `lossless=True`.

### Delivery encoding

On 18 October 2026, the tanh region figure and density plots were re-encoded
from the original portfolio assets at commit
`724ba2d4ca52337cb6afc5b1125e9b9af54efc73`. Dimensions and every alpha value
are unchanged. RGB encoding is lossy; the native-size visual review checked
the region boundaries, plot titles, axes, ticks and colour scales.

| Asset               |          Before |         After | Delivery encoding         |
| ------------------- | --------------: | ------------: | ------------------------- |
| `density-tanh.webp` | 1,628,008 bytes | 540,790 bytes | WebP quality 98, method 6 |
| `regions-tanh.webp` |   868,810 bytes | 748,660 bytes | WebP quality 92, method 6 |

Reproduce with Python and Pillow from the repository root:

```sh
python scripts/optimize-portfolio-media.py --source-ref 724ba2d4ca52337cb6afc5b1125e9b9af54efc73
```

The script also optimizes the SpellWar cover. It checks dimensions and alpha
after encoding. The explanatory diagram remains lossless, and the source
PDF remains the scientific reference.

## Content and interpretation

- Slides 10–11 explain ReLU activation patterns, PyTorch forward hooks and
  region identifiers. Say that the **network** is affine within a region,
  not that the underlying physics is linear there.
- Slides 13–18 distinguish smooth tanh/SiLU activations from piecewise
  affine ReLU. They present a first-order Taylor distance with clustering
  and an alternative based on quantiles. The smooth-activation partitions
  are empirical, not exact ReLU-style linear regions.
- Slides 23–24 present two local density approaches: a fixed circle and a
  fixed number of neighboring regions. The tanh heatmaps use different
  numerical scales. Their colors must not be read as a direct common-scale
  comparison or a measure of physical prediction error.
- Slides 26–30 document the OpenGL/ImGui viewer, its separation of rendering
  and interface panels, and frame export toward FFmpeg. Slide 26 contains
  a third-party ImGui example, not a PINNacle screenshot; it is not reused.
  The demonstration area on slide 28 is blank in the supplied PDF.
- Slides 32–34 label the results ReLU, tanh and SiLU. They do not establish
  equal training conditions or a numerical quality ranking. Avoid claims
  of improved accuracy or causal conclusions from the visible density.
- Slide 39 lists heatmap integration in the viewer as future work. The page
  therefore describes heatmaps as a separate analysis, not an existing
  viewer feature.

## Attribution

Preserve the confirmed contribution boundary in `PRODUCT.md` and
`CONTEXT.md`: Mathis worked on activation extraction, quantile sampling,
binary export and parts of the C++/OpenGL viewer. Slide 37 specifically
credits him for clustering/distance work, the OpenGL rendering and shaders,
and file export. Other participants contributed camera work, training
callbacks, ImGui panels, statistics and heatmaps. The defense's task table
and the repository contribution history do not describe identical scopes;
do not turn either into a claim that Mathis built the complete viewer alone.
Density analysis and heatmaps are attributed to the group. The code link
remains the upstream `setup` branch.

## Homepage thumbnail

`web/public/assets/home/pinnacle.webp` is a 600 × 338 thumbnail of
`pinnacle/cover.webp`, derived on 18 October 2026 for the homepage. Pillow
resized the complete source with Lanczos and encoded WebP at quality 88,
method 6. No crop, retouching or generated content was added. It remains the
same still frame extracted from the defense presentation, with no epoch or
activation assigned beyond the source evidence described above.

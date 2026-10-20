# About illustration

The personal interests illustration was restyled on 20 October 2026 with the
built-in `image_gen` tool in edit mode, with `transparent_background: true`.
The existing wooden grand piano provided the subject and viewpoint. A first
coloured-pencil/pastel version was then refined with looser drawing marks and a
hand-drawn cast shadow, as requested. It illustrates an interest in piano; it
does not represent an instrument owned by Mathis.

Delivery asset: `web/public/assets/about/grand-piano.webp`, 1254 × 1254,
689,854 bytes.

SHA-256: `19abc783a19ceb69bae079c90dab99dd7622efa32beb8410ec4dd0b9941cd613`.

The final generated PNG is retained locally as
`.cache/grand-piano-pastel-shadow.png`; its edit input is retained as
`.cache/grand-piano-pastel-generated.png`. The original polished drawing
remains in `.cache/grand-piano-generated.png`.

The WebP uses quality 92, with its complete canvas and generated alpha
preserved exactly. The source and decoded WebP alpha planes share the MD5
`fddb1c6a9481f7306ca90809209d2d7a`. BGRA input avoids an intermediate YUV
conversion of the input alpha. Colour compression retains the visible pencil
strokes and pastel grain. No resizing, crop or background removal was applied
during encoding.

```sh
ffmpeg -hide_banner -loglevel error \
  -i .cache/grand-piano-pastel-shadow.png \
  -c:v libwebp -q:v 92 -compression_level 6 -pix_fmt bgra \
  web/public/assets/about/grand-piano.webp
```

The image is decorative beside the translated piano/chess description, so it has
an empty alternative text. Its intrinsic dimensions reserve layout space; CSS
limits its displayed width while preserving its proportions. The drawn shadow
belongs to the image; the page adds no background panel or shadow filter.

## Final edit prompt

```text
Use case: style-transfer.
Input image: the current coloured-pencil grand piano. Edit THIS image, keeping its wooden grand piano, raised lid, keyboard, legs, warm colours and three-quarter viewpoint.
The user likes the direction. Push the handmade drawing character another small but clearly visible step: looser and slightly irregular pencil outlines, more broad matte dry-pastel strokes, simplified wood planes, expressive crosshatching. Reduce precise polished realism and micro-detail, particularly in the strings, hardware and wood grain. Keep it elegant and recognizable. It should feel like a personal sketchbook drawing in coloured pencils and soft pastels rather than a realistic rendering with a texture filter.
ADD a delicate HAND-DRAWN CAST SHADOW beneath the piano and its feet. Draw this shadow from sparse overlapping coloured-pencil hatching and grainy pastel strokes in muted warm grey and a hint of cool lavender. The shadow must clearly be made of drawing marks, not a smooth blurred photographic drop shadow. Keep it airy, restrained, softly broken at its edges, close to the instrument, and connected to the feet so the piano feels grounded. The shadow should read on both pale and dark page backgrounds.
Preserve a true transparent alpha background, including all open areas between the legs and between sparse shadow strokes. NO paper sheet, white rectangle, opaque ground plane, enclosing wash, vignette or checkerboard. Only the piano drawing and its small drawn shadow are visible.
Square canvas. Entire instrument and complete shadow visible, with a small transparent margin around all sides. Do not crop the feet or lid. Allow a little extra space below for the shadow. No text, logo, frame, person, bench, scenery or additional objects. Website illustration displayed at 260–400 pixels.
```

# Navigation paper artwork

The desktop navigation uses generated blank opaque white and pale grey paper with
straight edges and thin stacked page edges on the right as a single decorative
layer. The original image also contains a fine left binding crease, which the
display framing keeps outside the visible rail.
All labels, links, active states and controls remain real HTML. The image has no
text or functional controls. At widths up to 1100 px, the normal mobile header
is retained and this decorative layer is absent.

The asset was generated and then edited to clean white/grey notebook paper with
Codex's built-in `image_gen` on 19 October 2026. The final image keeps a calm
center, a rectangular silhouette and soft neutral grey shadows in the binding
crease and stacked page edges. It was encoded to WebP with Pillow at quality 85,
method 6, at its original dimensions and without retouching.

- Asset: `web/public/assets/navigation/book-page.webp`
- Size: 724 × 2172 pixels; 48,114 bytes
- SHA-256: `fafb109b4a7f8d79957b4bf63453263b4bc9b759a9f2b3f1ad9caa7bc0583f2a`

`web/src/styles.css` positions the image in the header's non-interactive
`::before` layer, below the live navigation. The texture uses
`right center / 106% 100%` sizing to fill the existing rectangular rail and hide
the source image's left binding crease while retaining the right-hand page edges.
This framing does not modify the original asset. The header
keeps `background: var(--surface)` and a `6px 0 18px #00000018` side shadow.
Rail dimensions, text insets and scrolling remain unchanged.

Only the decorative layer is filtered: `brightness(1)` gives white/grey paper
by day, and `brightness(0.19)` gives dark graphite in dark mode. The filter
interpolates over 500 ms; reduced motion disables that transition. Text and
focus indicators keep independent theme colours and are never filtered.

## Paper edit instruction

Prompt, verbatim:

```text
Use case: precise-object-edit. Edit target: the attached tall blank book-page texture used behind a website navigation menu. Change the paper material and colour only: replace the yellowed antique parchment with clean modern notebook/book paper, neutral white to very pale cool grey, matte uncoated paper with subtle fine grey fibers. Remove yellow, beige, sepia and brown tones, stains, speckles that look dirty, age marks and worn patches. Keep EXACTLY the same image dimensions, narrow portrait proportions, flat camera, rectangular silhouette, left binding crease and very fine stacked page edges on the right. Those edge details should now be soft neutral grey shadows on white paper, restrained and clear. The center must stay calm, almost uniform white/light grey, for dark live navigation labels. No ruling lines, writing, letters, numbers, grids, drawings, icons or extra decorations. No transparent areas, no surrounding scene. Preserve the quiet finely pixel-textured illustration character without making the paper look old.
```

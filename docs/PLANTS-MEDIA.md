# Plants gallery

The four WebP images in `web/public/assets/plants/` are screenshots of the
existing `@westerbay/lsystem-react` WebGL renderer, captured on 18 October 2026.
They use the original presets, their original palettes and the default camera,
lighting and shadows. There is no generated artwork or geometry reconstruction.
The transparent project-card thumbnail remains unchanged.

| File           | Preset           | Generations | Angle |
| -------------- | ---------------- | ----------- | ----- |
| `plant.webp`   | Branching plant  | 4           | 22.5° |
| `tree.webp`    | Branching tree   | 7           | 22.5° |
| `flower.webp`  | Flowering plant  | 5           | 22.5° |
| `hilbert.webp` | 3D Hilbert curve | 4           | 90°   |

All captures are 1200 × 800, in the explorer's light theme. The scene's
native labels and camera controls remain visible. PNG screenshots were encoded
as WebP at quality 90 without resizing or enhancement, about 290 KB in total.

## Reproduce

Serve the built standalone explorer from the sibling
`The-Algorithmic-Beauty-of-Plants/dist/site` directory, then run from this repo:

```sh
node scripts/capture-plants-gallery.mjs http://127.0.0.1:4180/
```

The script writes PNG files to `test-results/plants-captures`, or to an optional
second output-directory argument. It changes only the capture viewport size,
selects the four existing presets and waits for their actual WebGL frames.
Encode those PNGs with Pillow's `Image.save(..., quality=90)` to the asset paths
above. The portfolio's own Plants page can also be supplied as the source URL.

The descriptions follow the sibling repository's README, `src/core/presets.ts`,
grammar expansion and turtle geometry. Its implementation supports deterministic,
non-parametric grammars. The copy does not claim biological growth simulation.

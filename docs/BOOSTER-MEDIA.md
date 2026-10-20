# Booster Break media

## Source and capture

The images in `web/public/assets/booster-break/` are actual screenshots of
<https://booster.mathis-db.com/>, captured on 18 October 2026 at 1280 × 720.
The browser was anonymous, in French and in the app's dark theme. No account
was used and no private collection, player name or profile is visible.

| File             | Visible screen                                      | Reproduction                                                    |
| ---------------- | --------------------------------------------------- | --------------------------------------------------------------- |
| `packs.webp`     | Public pack chooser with Nuit Noire selected        | Open the app and select Boosters                                |
| `recap.webp`     | Ten-card Silver Tempest sandbox result              | Select Bac à sable, open Tempête Argentée, reveal all ten cards |
| `catalogue.webp` | Public Nuit Noire card catalogue, grouped by rarity | Select Boosters, then Voir les cartes de Nuit Noire             |
| `foil.webp`      | Zygarde card with its reverse holographic finish    | Ninth reveal in the same sandbox draw                           |

The catalogue capture shows the public expansion preview, not a personal collection. It replaces the former arena-rule screenshot. The Pokédex required sign-in, so it was not used. The replacement capture used a fresh anonymous Chromium session and only navigated the public card preview; no pack was opened and no remote data was changed during this replacement.

The sandbox draw is random, so a repeat capture will have different cards.
The UI explicitly labels its result as visual only and not added to the
collection. The local `PokemonSandboxService.openPack` implementation was
also inspected: it returns a generated response without persisting an opening
or modifying a collection. This capture did not create a trade, challenge,
account or saved pack opening.

The original PNG captures were encoded as RGB WebP using Pillow, quality 87,
method 6, at their original dimensions. There is no crop, retouching, generated
imagery or enhancement. The screenshots document the app; card illustrations,
Pokémon names and pack artwork remain the property of their respective owners.
The source repository describes Booster Break as an unofficial fan-made app.

## Copy evidence

The local sibling `Booster-Break` repository was inspected read-only at commit
`9611a12`, alongside the live public UI:

- `README.md`: TypeScript, React, Elysia, PostgreSQL and third-party card metadata.
- `apps/web/src/features/dashboard/views/CollectionView.tsx`: name, expansion,
  rarity, quantity and sort controls for the collection.
- `apps/api/src/pokemon/pokemon-sandbox-service.ts`: transient sandbox draws.
- `apps/web/src/features/trade/views/TradeView.tsx`: listings and card offers.
- `docs/pvp.md` and the live rulebook: three-card teams, limited total power,
  five energy, simultaneous hidden choices, up to three rounds and Elo ranking.
- `apps/web/src/features/dashboard/webgl/booster-tear-renderer.ts`: wrapper
  mesh, deformation and tear animation.
- `apps/web/src/features/dashboard/webgl/card-viewer-renderer.ts` and
  `card-shaders.ts`: WebGL rotation, finish profiles, texture layers and masks.

The text deliberately does not attribute a particular subsystem to Mathis or
his colleagues. The collaborative project description follows the portfolio's
confirmed content rules. The public rulebook and the local PvP documentation
differ in the starting Elo value, so no starting rating is claimed in the
portfolio. Authenticated trade and duel flows were not exercised.

## Decorative arena environment

On 20 October 2026, Codex's built-in `image_gen` created a pixel-art arena
for the Booster Break portfolio page. No API key or fallback CLI was used.
The subject follows the real app's circular platform, concentric gold rings,
blue-slate metal, angular arches and spectator tiers visible in `packs.webp`.
The open sky and distant architecture are decorative interpretations, not
screenshots or claims about playable environments. All original app captures
remain unchanged.

The daytime scene was generated first; the night image is a lighting edit
of that output. The arches, stairs, terraces, circular platform and skyline
were visually checked for matching composition. Clear blue sky and pale steel
daylight become a midnight-blue sky, sparse stars, cool clouds and amber
architectural lighting at night.
The artwork has no interface, text or characters. Both files are 1672 × 941
pixels; the requested 1920 × 1080 landscape was supplied at this size.

The shared `web/src/project-world.css` provides fixed layers, the existing
900 ms crossfade and immediate switching for reduced motion. Booster's
section layout, cover container dimensions, spacing and tags stay unchanged.
Its cover backdrop stays transparent in both themes; the shared 8–14 px media
matte frames the actual screenshot rather than the letterboxed container.
Story images use the same frame as Eyefox and SpellWar. The scenery shares
their contrast veil without an additional Booster tint.
The Guide retains its ordinary background and the adventurer companion.

### Runtime files

The generated PNG originals are retained locally in ignored `.cache/` files.
FFmpeg encoded WebP quality 90, compression level 6, YUV420P, without resizing,
cropping or retouching. This is lossy compression, not a pixel-identical archive.

| Asset                                              | Dimensions |  Bytes | SHA-256                                                            |
| -------------------------------------------------- | ---------- | -----: | ------------------------------------------------------------------ |
| `web/public/assets/world/booster-break-day.webp`   | 1672 × 941 | 397304 | `9b493e171524986962458f1ab934305192970aa5a0185abaf787cf60dca49ab1` |
| `web/public/assets/world/booster-break-night.webp` | 1672 × 941 | 365176 | `b53cdb9e9c912942c8619a125aa1fe3d0966e53c95e546511db7edf2f31d99ce` |

Encoding, for each period (`day` or `night`):

```sh
ffmpeg -i .cache/booster-break-day-generated.png -c:v libwebp -q:v 90 -compression_level 6 -pix_fmt yuv420p web/public/assets/world/booster-break-day.webp
```

### Daytime prompt

Built-in `image_gen`, opaque output, no input image. The app screenshots and
existing SpellWar background were inspected beforehand to inform the prompt.

```text
Use case: stylized-concept.
Asset type: a standalone opaque PIXEL ART environment background for the Booster Break portfolio page, landscape 1920 by 1080, no interface.
Primary request: a spacious futuristic trading-card tournament arena, interpreted as a beautiful 2D game background. It should feel related to a world of collectible card duels and pack opening through its architecture, not through giant cards or lettering.
Scene: a large circular arena chamber, three-quarter perspective, low concentric elliptical tournament platform in the lower-right half, inset concentric brass/gold rings, broad blue-slate metallic floor; layered curved spectator terraces and monumental angular steel arches frame the far left and right. Muted ivory stone and pale steel on illuminated surfaces. A tall open roof/skylight reveals a large area of luminous blue DAYTIME sky and soft ivory clouds in the upper center and right, about one third of the image. Fine restrained amber light strips within architectural joints. No spectators.
Style: carefully clustered crisp pixel art, readable stepped silhouettes, rich but disciplined 2D game environmental art, matching sophisticated forest/floating-island pixel-art portfolio worlds. Pixel edges and controlled dithering, no smooth 3D render, no photograph, no oil paint. Environment remains visually coherent at desktop and 4K sizes.
Composition: widescreen atmospheric establishing view; architectural detail and strongest focal interest on the outer edges and lower right. Keep the left-center and center comparatively calm, with broad shaded surfaces so website text can be overlaid later. Do not paint any actual overlay, vignette, text, panel or interface. Make the sky visible at the top-right and preserve a memorable geometric silhouette suitable for an exactly aligned dusk version later.
Lighting: unmistakable clear DAYLIGHT, cool pale-blue bounce, natural ivory sunlight on steel/stone, subtle gold accents. Broad shadowed slate-blue architecture contrasts with the luminous open sky. Bright but not washed out.
Constraints: one complete original background scene only; no text, numbers, logos, Pokémon symbols, cards, packs, creatures, people, characters, UI, borders, watermark, bloom or blur. Avoid a black void or green palette. The scene is empty, still and ready for a recolour-only dusk counterpart.
```

### Night edit prompt

Built-in `image_gen`, opaque output; the generated daytime PNG was the edit
target supplied with `referenced_image_paths`.

```text
Use case: lighting-weather.
Asset type: exactly aligned NIGHT variant of a pixel-art arena website background.
Input image is the EXACT EDIT TARGET: the daytime slate-blue, ivory and gold circular arena. Preserve the original canvas size, camera, framing, composition, every arch, stair, tier, handrail, floor tile, gold ring, cloud outline and distant architectural silhouette. This will crossfade over the original: the geometry must remain still and aligned.
Change ONLY the time of day and illumination to unmistakable DEEP NIGHT, well after sunset. The open sky becomes deep midnight navy with a handful of tiny crisp pale stars in the existing clear areas. Keep the SAME clouds in the SAME positions, now subdued cool blue-grey clouds, NO orange or peach horizon, NO pink/violet dusk, NO remaining daylight. Keep all distant buildings but relight them as cool moonlit blue silhouettes. Use soft cool moonlight from outside the frame, do NOT add a moon or new celestial object apart from small sparse stars. The existing gold architectural lines and arena rings emit controlled warm amber light; preserve their shapes and positions. Fine blue reflections on stone/steel and restrained amber reflections along the existing floor shapes. The scene must remain beautifully readable, not crushed into a flat black image; retain tiers, stairs, details and depth. Clearly night, not blue hour or sunset.
Keep the exact same pixel art style, crisp pixel clusters and edges. No smoothing, blur, bloom, grain, redesign, new architecture, characters, cards, creatures, lettering, branding, interface, overlays, borders or watermark. Output only the one complete opaque environment image, same dimensions and camera as input.
```

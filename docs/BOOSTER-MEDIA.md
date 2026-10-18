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

# Eyefox Puzzle media

## Original Android screenshots

The two images in `web/public/assets/eyefox/` come from the original screenshots
in the sibling `Eyefox-Puzzle` repository, inspected at commit `70c5b9a` on
18 October 2026. These are existing Android captures, not new captures of the
browser component.

| Portfolio file      | Original source                  | Dimensions  |
| ------------------- | -------------------------------- | ----------- |
| `android-game.webp` | `screenshots/game_land.jpg`      | 2302 × 1080 |
| `android-menu.webp` | `screenshots/maintitle_land.jpg` | 2311 × 1080 |

Each source JPEG was converted to RGB WebP using Pillow, quality 90, method 6,
at its original dimensions. No crop, enlargement, retouching or generated media
was used. The sources' pixel-art style and existing JPEG compression are retained.

The original README credits third-party assets from itch.io, including Monogram
by datagoblin, Pixel Fantasy Caves by szadiart, GUI elements by mounirtohami and fox
sprites by Elthen. The portfolio does not claim that Mathis created the artwork.
See the original [asset credits](https://github.com/Westerbay/Eyefox-Puzzle#asset-credits).

## Page environment

The page uses a generated pixel-art forest, with daylight and twilight variants
following the site's theme. This forest is exclusive to Eyefox; SpellWar uses
its own floating-platform landscape and the full Guide uses the normal portfolio
background. The two project environments share `web/src/project-world.css` for
their fixed scenery layers, palette and transition behavior.
See [FOREST-MEDIA.md](FOREST-MEDIA.md) for the reference, prompts and asset paths.
This scenery is portfolio artwork, not a capture of the Android game.

The environment and contrast gradient stay fixed to the viewport. Vite resolves
the public asset URLs against the deployment base. The theme control changes
both the scenery and interface: cream surfaces and dark text in light mode,
graphite surfaces and light text in dark mode, with amber primary actions in
both. Palette colours transition over 500 ms and the aligned forest images
crossfade over 900 ms; reduced motion makes both changes instant. The embedded
puzzle receives the resolved theme without remounting, preserving game progress.

Article text stays white directly over the forest, without a reading panel or
content-level gradient. It keeps the shared project layout: technologies on the
left and introductory text on the right, then story headings beside their prose
and captures below. The fixed scenery veil and a restrained text shadow provide
contrast.

Android screenshots retain their original artwork and sit on a light or dark
matte matching the current theme. The interactive tile grids keep their original
sprites inside an opaque game panel, with themed controls and restrained shadows.

The game's cave background, visible in the Android screenshots, was credited
by its README to [Pixel Fantasy Caves by Szadi art](https://szadiart.itch.io/pixel-fantasy-caves).
The artwork retains its creator's terms; the game's GPL code license does not
grant a separate artwork license.

## Copy evidence

- `README.md`: academic Android/Java project; matching two grids by flipping a
  tile and its neighbours; browser demo with three difficulty shortcuts and no
  Android campaign or saved progression.
- `app/src/main/java/games/wester/eyefoxpuzzle/puzzle/Puzzle.java`: Boolean grid
  and the tile-flip operation.
- `app/src/main/java/games/wester/westerlib/util/Grid.java`, `computesNeighbors`:
  all eight surrounding cells are included when in bounds, including diagonals.
- `app/src/main/java/games/wester/eyefoxpuzzle/puzzle/LevelStage.java`: random
  target copied and transformed through valid moves; grid size, move budget and
  attempts. Applying the same flips again supplies a solution, without claiming
  that the recorded move count is always minimal.
- `app/src/main/java/games/wester/eyefoxpuzzle/puzzle/Game.java` and
  `save/LevelSave.java`: level progression persisted through Android
  `SharedPreferences`.
- `core/PuzzleManager.java`: interaction and animation orchestration around the
  puzzle model.

The Android executable was not run during this content update. The screenshots
were visually checked against the source files and the wording was verified
against the implementation. The browser demo remains a separate interactive
preview on the portfolio. No store button, app availability claim or APK link
was added.

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

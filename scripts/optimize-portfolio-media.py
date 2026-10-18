"""Encode portfolio delivery images from original assets, preserving aspect ratio."""

import argparse
from io import BytesIO
from pathlib import Path
import subprocess

from PIL import Image, ImageChops


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    source_group = parser.add_mutually_exclusive_group(required=True)
    source_group.add_argument("--source-ref")
    source_group.add_argument("--source-directory", type=Path)
    parser.add_argument("--companion-only", action="store_true")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    assets = "web/public/assets/"
    selections = [
        ("spellwar-gameplay.png", "spellwar/gameplay.webp", 90, None),
        ("pinnacle/density-tanh.webp", "pinnacle/density-tanh.webp", 98, None),
        ("pinnacle/regions-tanh.webp", "pinnacle/regions-tanh.webp", 92, None),
        ("avatar.png", "avatar.webp", 90, None),
        ("avatar.png", "avatar-128.webp", 90, 128),
        ("ensicaen.png", "ensicaen.webp", 95, 128),
        ("plants-render.png", "plants-render.webp", 95, None),
        ("companion/adventurer-atlas.png", "companion/adventurer-atlas.webp", None, None),
        ("companion/adventurer-talk.png", "companion/adventurer-talk.webp", None, None),
        ("companion/fox-atlas.png", "companion/fox-atlas.webp", None, None),
        ("companion/fox-talk.png", "companion/fox-talk.webp", None, None),
    ]
    if args.companion_only:
        selections = [item for item in selections if item[0].startswith("companion/")]
    for source, destination, quality, max_size in selections:
        if args.source_directory:
            original = (args.source_directory / source).read_bytes()
        else:
            original = subprocess.run(
                ["git", "show", f"{args.source_ref}:{assets}{source}"],
                cwd=root,
                check=True,
                capture_output=True,
            ).stdout
        image = Image.open(BytesIO(original)).convert("RGBA")
        if max_size:
            image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        path = root / assets / destination
        path.parent.mkdir(parents=True, exist_ok=True)
        if quality is None:
            image.save(path, format="WEBP", lossless=True, exact=True, quality=100, method=6)
        else:
            image.save(path, format="WEBP", quality=quality, method=6)
        result = Image.open(path).convert("RGBA")
        if result.size != image.size or ImageChops.difference(
            image.getchannel("A"), result.getchannel("A")
        ).getbbox():
            raise RuntimeError(f"Dimensions or alpha changed for {destination}")
        if quality is None and result.tobytes() != image.tobytes():
            raise RuntimeError(f"Decoded RGBA pixels changed for {destination}")
        print(f"{destination}: {len(original)} -> {path.stat().st_size} bytes")


if __name__ == "__main__":
    main()

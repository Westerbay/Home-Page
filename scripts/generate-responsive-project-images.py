"""Derive uncropped responsive project images from the existing portfolio media."""

import json
from pathlib import Path

from PIL import Image, ImageChops


def main():
    root = Path(__file__).resolve().parents[1]
    assets = root / "web/public/assets"
    manifest = {}
    images = [
        ("booster-break/packs.webp", "booster-break/packs.webp"),
        ("spellwar/gameplay.webp", "spellwar/gameplay.webp"),
        ("spellwar/gravity-transition-poster.webp", "spellwar/gravity-transition-poster.webp"),
        ("pinnacle/cover.webp", "pinnacle/cover.webp"),
        ("stylegan-cheap-dit/cover.webp", "stylegan-cheap-dit/cover.webp"),
        ("plants-render.webp", "plants-render.png"),
        ("eyefox.png", "eyefox.png"),
        ("spellwar/engine-world.webp", "spellwar/engine-world.webp"),
        ("spellwar/platform-orientations.webp", "spellwar/platform-orientations.webp"),
        ("spellwar/generated-world.webp", "spellwar/generated-world.webp"),
        ("pinnacle/activation-extraction.webp", "pinnacle/activation-extraction.webp"),
        ("pinnacle/regions-relu.webp", "pinnacle/regions-relu.webp"),
        ("pinnacle/regions-tanh.webp", "pinnacle/regions-tanh.webp"),
        ("pinnacle/regions-silu.webp", "pinnacle/regions-silu.webp"),
        ("pinnacle/density-tanh.webp", "pinnacle/density-tanh.webp"),
    ]
    for delivery, source in images:
        original = Image.open(assets / source).convert("RGBA")
        sources = []
        for width in (480, 800, 1280):
            if width >= original.width:
                continue
            height = round(original.height * width / original.width)
            resized = original.resize((width, height), Image.Resampling.LANCZOS)
            destination = Path(delivery).with_name(f"{Path(delivery).stem}-{width}.webp")
            output = assets / destination
            resized.save(output, format="WEBP", quality=92, method=6)
            decoded = Image.open(output).convert("RGBA")
            if decoded.size != resized.size or ImageChops.difference(
                decoded.getchannel("A"), resized.getchannel("A")
            ).getbbox():
                raise RuntimeError(f"Dimensions or alpha changed: {destination}")
            sources.append({"src": f"assets/{destination.as_posix()}", "width": width})
            print(f"{destination}: {width} x {height}, {output.stat().st_size} bytes")
        sources.append({"src": f"assets/{delivery}", "width": original.width})
        manifest[f"assets/{delivery}"] = {
            "width": original.width,
            "height": original.height,
            "sources": sources,
        }
    destination = root / "web/src/features/projects/data/project-images.json"
    destination.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()

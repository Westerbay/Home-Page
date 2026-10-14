"""Capture reproducible Cheap DiT outputs inside its pinned Docker image.

Run with the command documented in docs/GENERATIVE-MEDIA.md.
This helper performs local inference only and does not train or change weights.
"""
import argparse
import hashlib
import json
import time
from pathlib import Path

import torch
from torchvision.utils import save_image
from api.service import LDMService

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--output", type=Path, default=Path("/output"))
parser.add_argument("--seed", type=int, default=20261014)
parser.add_argument("--count", type=int, default=1)
parser.add_argument("--benchmark-steps", type=int, default=0)
args = parser.parse_args()
if args.count < 1 or args.benchmark_steps < 0:
    parser.error("count must be positive and benchmark-steps cannot be negative")
torch.set_num_threads(4)
torch.backends.mha.set_fastpath_enabled(False)
torch.set_num_interop_threads(1)
service = LDMService()
service.load_model()
model = service.ldm
checkpoint = Path("models/ldm.pth")
checkpoint_hash = hashlib.sha256(checkpoint.read_bytes()).hexdigest()
args.output.mkdir(parents=True, exist_ok=True)
frames = {1, 200, 400, 600, 800, 1000}
records = []
for index in range(args.count):
    seed = args.seed + index
    torch.manual_seed(seed)
    z = model.sample_api_init(1)
    started = time.monotonic()
    steps = args.benchmark_steps or model.time_steps
    for step in range(steps):
        z, image = model.sample_api_step(z, step)
        completed = step + 1
        if not args.benchmark_steps and index == 0 and completed in frames:
            save_image((image[0] + 1) / 2, args.output / f"step-{completed:04}.png")
        if completed % 100 == 0 or completed == steps:
            print(f"Seed {seed}, step {completed}/{steps}, elapsed {time.monotonic() - started:.1f}s", flush=True)
    elapsed = time.monotonic() - started
    if args.benchmark_steps:
        print(json.dumps({"steps": steps, "seconds": elapsed, "seconds_per_step": elapsed / steps}), flush=True)
        break
    filename = f"dit-seed-{seed}.png"
    save_image((image[0] + 1) / 2, args.output / filename)
    records.append({"file": filename, "seed": seed, "steps": steps, "seconds": round(elapsed, 2)})
if records:
    (args.output / "generation.json").write_text(json.dumps({
        "checkpoint_sha256": checkpoint_hash,
        "torch_version": torch.__version__,
        "device": str(model.device),
        "samples": records,
        "sequence_seed": args.seed,
        "sequence_steps": sorted(frames),
    }, indent=2) + "\n")

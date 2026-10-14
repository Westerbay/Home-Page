# StyleGAN & Cheap DiT media

The project detail is a static gallery. Runtime generation, a public API and
Cloudflare hosting are deferred to V2. The source project is
[StyleGan-and-Cheap-DiT](https://github.com/Westerbay/StyleGan-and-Cheap-DiT),
revision `855cd736024bb065349f4da637240986cd0e7ed2`.

## Saved training outputs

Source grids:

- `samples_ldm/diffusion/epoch_200.png`: 4 columns, 2 rows of 256 × 256 outputs.
- `samples_ldm/diffusion/epoch_230.png`: the same layout.
- `samples_gan/epoch_400.png`: a 4 × 4 grid of outputs.
- `samples_ldm/vae/vae_reconstruction_20.png`: 8 reference images on the first
  row and their VAE reconstructions on the second.

The torchvision grids have 2-pixel padding. Extract each sample at
`x = 2 + column * 258`, `y = 2 + row * 258`, with a 256 × 256 crop.
All display assets are lossless WebP, with no AI enhancement or retouching.

The GAN comparison selects zero-based grid positions `0, 1, 2, 8, 14, 11`,
including visible repetitions. The VAE comparison selects columns `0` and `6`
on both rows. The cover uses diffusion samples `200/01`, `200/02`, `200/03`,
`200/04`, `230/01`, `230/02`, `230/07`, `230/08`.

The public gallery selects all eight epoch-200 samples and the first seven
epoch-230 samples, followed by the fresh Docker-generated sample with seed
`20261020`, selected from 16 consecutive seeds (`20261015` through `20261030`).

The gallery is a curated illustration of the experiments, not a quantitative
quality benchmark. Do not describe saved training outputs as a newly generated
batch, and do not describe VAE reference images as generated images.

## Docker inference and denoising sequence

Use the immutable image digest:

```text
ghcr.io/westerbay/stylegan-and-cheap-dit@sha256:a57fe3924e46c7d24f145f1dfd7bae93e723d27d5c4eeb2a7a2bbd3631c7e87a
```

Its OCI revision matches the source revision above. The helper loads the
included checkpoint, runs the original 1,000-step sampler and captures VAE
decodes after steps 1, 200, 400, 600, 800 and 1,000. It records the seed,
checkpoint hash, PyTorch version, device and timings in `generation.json`.
PyTorch's native MHA fast path is disabled in the helper on both CPU and GPU.
Model architecture, weights and sampling equations are unchanged.
Exact pixels can vary across PyTorch versions, hardware and execution paths.

Run from the portfolio root. Outputs stay outside the checkout until reviewed:

```sh
mkdir -p /tmp/dit-gallery/generated
docker run --rm --name portfolio-dit-gallery \
  --network none --gpus all --cpus 6 --memory 6g \
  -e PYTHONPATH=/app/stylegan-and-cheap-dit \
  -v "$(pwd):/portfolio:ro" \
  -v /tmp/dit-gallery/generated:/output \
  --entrypoint python \
  ghcr.io/westerbay/stylegan-and-cheap-dit@sha256:a57fe3924e46c7d24f145f1dfd7bae93e723d27d5c4eeb2a7a2bbd3631c7e87a \
  /portfolio/scripts/generate-dit-gallery.py --seed 20261020 --count 1
```

Add `--benchmark-steps 5` to measure inference without generating a full image.
The reviewed batch ran on an NVIDIA GeForce RTX 5070 Ti with PyTorch
`2.14.1+cu130`, in FP32 with batch size 1. The 16 candidates took 115.46 seconds
of sampling in total. The selected seed was then regenerated in 8.25 seconds
to capture its denoising sequence; its final PNG matched the reviewed candidate
exactly. These timings exclude Docker startup and checkpoint loading.

The selected output has a more readable composition than the previous CPU
sample, but still shows the model's blurry and merged forms. Selection does not
imply improved model quality. No training or checkpoint modification is
performed, and no port is exposed. Remove `--gpus all` to use CPU inference,
which is substantially slower.

Convert reviewed PNGs to lossless WebP in
`web/public/assets/stylegan-cheap-dit/`. Keep the generation metadata alongside
those assets. The metadata records original PNG filenames; the public images
use the same stems with a `.webp` extension. Increasing `--count` creates consecutive seeds; only the first
sample gets intermediate frames. Review new outputs before adding them to the
public selection.

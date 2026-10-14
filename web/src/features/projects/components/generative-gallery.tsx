import * as m from "@workspace/i18n/messages"
import { assetUrl } from "../../../lib/assets"
import { diffusionSamples, denoisingSteps } from "../data/generative-gallery"

export function GenerativeGallery() {
  return (
    <div className="generative-gallery">
      <section aria-labelledby="diffusion-gallery-title">
        <div className="gallery-heading">
          <p className="eyebrow">Cheap DiT · 256 × 256</p>
          <h2 id="diffusion-gallery-title">{m.dit_gallery_title()}</h2>
          <p>{m.dit_gallery_intro()}</p>
        </div>
        <p className="gallery-provenance">{m.dit_gallery_provenance()}</p>
        <div className="diffusion-grid">
          {diffusionSamples.map((sample) => (
            <figure key={sample.id}>
              <a href={assetUrl(sample.image)}>
                <img
                  src={assetUrl(sample.image)}
                  alt={m.dit_sample_alt({ index: sample.id })}
                  width={256}
                  height={256}
                  loading="lazy"
                />
              </a>
              <figcaption>
                {m.dit_sample_caption({ index: sample.id })}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section aria-labelledby="denoising-title">
        <div className="gallery-heading">
          <h2 id="denoising-title">{m.dit_process_title()}</h2>
          <p>{m.dit_process_intro()}</p>
        </div>
        <div className="denoising-grid">
          {denoisingSteps.map((frame) => (
            <figure key={frame.step}>
              <img
                src={assetUrl(frame.image)}
                alt={m.dit_step_alt({ step: frame.step })}
                width={256}
                height={256}
                loading="lazy"
              />
              <figcaption>
                {m.dit_step_caption({ step: frame.step })}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <div className="model-comparisons">
        <section aria-labelledby="gan-gallery-title">
          <div className="gallery-heading">
            <h2 id="gan-gallery-title">{m.dit_gan_title()}</h2>
            <p>{m.dit_gan_intro()}</p>
          </div>
          <figure>
            <img
              src={assetUrl("assets/stylegan-cheap-dit/gan-epoch-400.webp")}
              alt={m.dit_gan_alt()}
              width={776}
              height={518}
              loading="lazy"
            />
            <figcaption>{m.dit_gan_caption()}</figcaption>
          </figure>
        </section>
        <section aria-labelledby="vae-gallery-title">
          <div className="gallery-heading">
            <h2 id="vae-gallery-title">{m.dit_vae_title()}</h2>
            <p>{m.dit_vae_intro()}</p>
          </div>
          <figure>
            <img
              src={assetUrl("assets/stylegan-cheap-dit/vae-epoch-20.webp")}
              alt={m.dit_vae_alt()}
              width={518}
              height={518}
              loading="lazy"
            />
            <figcaption>{m.dit_vae_caption()}</figcaption>
          </figure>
        </section>
      </div>
    </div>
  )
}

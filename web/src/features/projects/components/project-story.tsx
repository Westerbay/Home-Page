import { assetUrl } from "../../../lib/assets"
import type { ProjectStorySection } from "../data/project-stories"

export function ProjectStory({
  sections,
}: {
  sections: ProjectStorySection[]
}) {
  if (sections.length === 0) return null

  return (
    <div className="project-story">
      {sections.map((section, index) => (
        <section
          className="story-section"
          aria-labelledby={`story-${section.id}`}
          key={section.id}
        >
          <div className="story-intro">
            <header className="story-heading">
              <span className="story-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 id={`story-${section.id}`}>{section.title}</h2>
            </header>
            <div className="story-prose">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          {section.images.length > 0 && (
            <div className="story-images">
              {section.images.map((image) => (
                <figure key={image.src}>
                  <a href={assetUrl(image.src)}>
                    <img
                      src={assetUrl(image.src)}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                  <figcaption>{image.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}
          {section.video && (
            <figure className="story-video">
              <video
                src={assetUrl(section.video.src)}
                poster={assetUrl(section.video.poster)}
                width={section.video.width}
                height={section.video.height}
                aria-label={section.video.description}
                aria-describedby={`story-${section.id}-video-caption`}
                controls
                playsInline
                muted
                autoPlay
                loop
                preload="auto"
              >
                <a href={assetUrl(section.video.src)}>
                  {section.video.caption}
                </a>
              </video>
              <figcaption id={`story-${section.id}-video-caption`}>
                {section.video.caption}
              </figcaption>
            </figure>
          )}
        </section>
      ))}
    </div>
  )
}

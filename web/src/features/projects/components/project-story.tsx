import { assetUrl } from "../../../lib/assets"
import type { ProjectStorySection } from "../data/project-stories"
import { getProjectImage } from "../data/project-image"
import { StoryVideo } from "./story-video"

function storyImageSizes(count: number) {
  if (count === 1) {
    return "(max-width: 600px) calc(100vw - 44px), min(90vw, 2600px)"
  }
  const mobile =
    "(max-width: 600px) calc(100vw - 44px), (max-width: 800px) 90vw"
  if (count === 3) {
    return `${mobile}, calc((min(90vw, 2600px) - clamp(48px, 3.6vw, 80px)) / 3)`
  }
  return `${mobile}, calc((min(90vw, 2600px) - clamp(24px, 1.8vw, 40px)) / 2)`
}

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
              {section.images.map((image) => {
                const responsive = getProjectImage(image.src)
                const sizes = responsive
                  ? storyImageSizes(section.images.length)
                  : undefined
                return (
                  <figure key={image.src}>
                    <a href={assetUrl(image.src)}>
                      <img
                        src={assetUrl(image.src)}
                        srcSet={responsive?.srcSet}
                        sizes={sizes}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                )
              })}
            </div>
          )}
          {section.video && (
            <figure className="story-video">
              <StoryVideo
                video={section.video}
                captionId={`story-${section.id}-video-caption`}
              />
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

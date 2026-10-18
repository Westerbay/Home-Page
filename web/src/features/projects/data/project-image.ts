import { assetUrl } from "../../../lib/assets"
import generatedImages from "./project-images.json"

interface ProjectImage {
  width: number
  height: number
  sources: { src: string; width: number }[]
}

const projectImages: Record<string, ProjectImage | undefined> = generatedImages

export function getProjectImage(source: string) {
  const image = projectImages[source]
  if (!image) return
  return {
    width: image.width,
    height: image.height,
    srcSet: image.sources
      .map((candidate) => `${assetUrl(candidate.src)} ${candidate.width}w`)
      .join(", "),
  }
}

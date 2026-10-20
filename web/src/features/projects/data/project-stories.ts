import { getBoosterStory } from "./stories/booster-break"
import { getEyefoxStory } from "./stories/eyefox"
import { getPinnacleStory } from "./stories/pinnacle"
import { getPlantsStory } from "./stories/plants"
import { getSpellwarStory } from "./stories/spellwar"

interface ProjectStoryImage {
  src: string
  alt: string
  caption: string
  width: number
  height: number
}

export interface ProjectStoryVideo {
  src: string
  poster: string
  description: string
  caption: string
  width: number
  height: number
}

export interface ProjectStorySection {
  id: string
  title: string
  paragraphs: string[]
  images: ProjectStoryImage[]
  video?: ProjectStoryVideo
}

export function getProjectStory(slug: string): ProjectStorySection[] {
  switch (slug) {
    case "booster-break":
      return getBoosterStory()
    case "eyefox":
      return getEyefoxStory()
    case "pinnacle":
      return getPinnacleStory()
    case "plants":
      return getPlantsStory()
    case "spellwar":
      return getSpellwarStory()
    default:
      return []
  }
}

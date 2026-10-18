import * as m from "@workspace/i18n/messages"
import type { ProjectStorySection } from "../project-stories"

export function getBoosterStory(): ProjectStorySection[] {
  return [
    {
      id: "opening",
      title: m.booster_story_opening_title(),
      paragraphs: [m.booster_story_opening_p1(), m.booster_story_opening_p2()],
      images: [
        {
          src: "assets/booster-break/packs.webp",
          alt: m.booster_story_packs_alt(),
          caption: m.booster_story_packs_caption(),
          width: 1280,
          height: 720,
        },
        {
          src: "assets/booster-break/recap.webp",
          alt: m.booster_story_recap_alt(),
          caption: m.booster_story_recap_caption(),
          width: 1280,
          height: 720,
        },
      ],
    },
    {
      id: "collection-and-duels",
      title: m.booster_story_duels_title(),
      paragraphs: [m.booster_story_duels_p1(), m.booster_story_duels_p2()],
      images: [
        {
          src: "assets/booster-break/catalogue.webp",
          alt: m.booster_story_duels_alt(),
          caption: m.booster_story_duels_caption(),
          width: 1280,
          height: 720,
        },
      ],
    },
    {
      id: "webgl",
      title: m.booster_story_webgl_title(),
      paragraphs: [m.booster_story_webgl_p1(), m.booster_story_webgl_p2()],
      images: [
        {
          src: "assets/booster-break/foil.webp",
          alt: m.booster_story_foil_alt(),
          caption: m.booster_story_foil_caption(),
          width: 1280,
          height: 720,
        },
      ],
    },
  ]
}

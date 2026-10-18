import * as m from "@workspace/i18n/messages"
import type { ProjectStorySection } from "../project-stories"

export function getSpellwarStory(): ProjectStorySection[] {
  return [
    {
      id: "engine",
      title: m.spellwar_story_engine_title(),
      paragraphs: [m.spellwar_story_engine_p1(), m.spellwar_story_engine_p2()],
      images: [
        {
          src: "assets/spellwar/engine-world.webp",
          alt: m.spellwar_story_engine_alt(),
          caption: m.spellwar_story_engine_caption(),
          width: 1600,
          height: 900,
        },
      ],
    },
    {
      id: "physics",
      title: m.spellwar_story_physics_title(),
      paragraphs: [
        m.spellwar_story_physics_p1(),
        m.spellwar_story_physics_p2(),
        m.spellwar_story_physics_p3(),
      ],
      images: [
        {
          src: "assets/spellwar/platform-orientations.webp",
          alt: m.spellwar_story_platforms_alt(),
          caption: m.spellwar_story_platforms_caption(),
          width: 1600,
          height: 900,
        },
        {
          src: "assets/spellwar/generated-world.webp",
          alt: m.spellwar_story_terrain_alt(),
          caption: m.spellwar_story_terrain_caption(),
          width: 1600,
          height: 900,
        },
      ],
    },
    {
      id: "rendering",
      title: m.spellwar_story_rendering_title(),
      paragraphs: [
        m.spellwar_story_rendering_p1(),
        m.spellwar_story_rendering_p2(),
      ],
      images: [],
      video: {
        src: "assets/spellwar/gravity-transition.mp4",
        poster: "assets/spellwar/gravity-transition-poster.webp",
        description: m.spellwar_story_rendering_alt(),
        caption: m.spellwar_story_rendering_caption(),
        width: 1280,
        height: 720,
      },
    },
  ]
}

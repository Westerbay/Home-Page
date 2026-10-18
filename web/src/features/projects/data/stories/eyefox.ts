import * as m from "@workspace/i18n/messages"
import type { ProjectStorySection } from "../project-stories"

export function getEyefoxStory(): ProjectStorySection[] {
  return [
    {
      id: "eyefox-rule",
      title: m.eyefox_story_rule_title(),
      paragraphs: [m.eyefox_story_rule_p1(), m.eyefox_story_rule_p2()],
      images: [
        {
          src: "assets/eyefox/android-game.webp",
          alt: m.eyefox_story_game_alt(),
          caption: m.eyefox_story_game_caption(),
          width: 2302,
          height: 1080,
        },
      ],
    },
    {
      id: "eyefox-android",
      title: m.eyefox_story_android_title(),
      paragraphs: [m.eyefox_story_android_p1(), m.eyefox_story_android_p2()],
      images: [
        {
          src: "assets/eyefox/android-menu.webp",
          alt: m.eyefox_story_menu_alt(),
          caption: m.eyefox_story_menu_caption(),
          width: 2311,
          height: 1080,
        },
      ],
    },
  ]
}

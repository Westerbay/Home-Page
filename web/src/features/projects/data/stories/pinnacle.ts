import * as m from "@workspace/i18n/messages"
import type { ProjectStorySection } from "../project-stories"

export function getPinnacleStory(): ProjectStorySection[] {
  return [
    {
      id: "activation-regions",
      title: m.pinnacle_story_method_title(),
      paragraphs: [m.pinnacle_story_method_p1(), m.pinnacle_story_method_p2()],
      images: [
        {
          src: "assets/pinnacle/activation-extraction.webp",
          alt: m.pinnacle_story_method_alt(),
          caption: m.pinnacle_story_method_caption(),
          width: 1840,
          height: 910,
        },
      ],
    },
    {
      id: "visualizing-the-regions",
      title: m.pinnacle_story_viewer_title(),
      paragraphs: [m.pinnacle_story_viewer_p1(), m.pinnacle_story_viewer_p2()],
      images: [
        {
          src: "assets/pinnacle/regions-relu.webp",
          alt: m.pinnacle_story_relu_alt(),
          caption: m.pinnacle_story_relu_caption(),
          width: 832,
          height: 816,
        },
        {
          src: "assets/pinnacle/regions-tanh.webp",
          alt: m.pinnacle_story_tanh_alt(),
          caption: m.pinnacle_story_tanh_caption(),
          width: 1400,
          height: 1400,
        },
        {
          src: "assets/pinnacle/regions-silu.webp",
          alt: m.pinnacle_story_silu_alt(),
          caption: m.pinnacle_story_silu_caption(),
          width: 919,
          height: 862,
        },
      ],
    },
    {
      id: "density-and-interpretation",
      title: m.pinnacle_story_density_title(),
      paragraphs: [
        m.pinnacle_story_density_p1(),
        m.pinnacle_story_density_p2(),
      ],
      images: [
        {
          src: "assets/pinnacle/density-tanh.webp",
          alt: m.pinnacle_story_density_alt(),
          caption: m.pinnacle_story_density_caption(),
          width: 2048,
          height: 1014,
        },
      ],
    },
  ]
}

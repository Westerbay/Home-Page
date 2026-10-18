import * as m from "@workspace/i18n/messages"
import type { ProjectStorySection } from "../project-stories"

export function getPlantsStory(): ProjectStorySection[] {
  return [
    {
      id: "plants-grammar",
      title: m.plants_grammar_title(),
      paragraphs: [m.plants_grammar_body(), m.plants_turtle_body()],
      images: [
        {
          src: "assets/plants/plant.webp",
          alt: m.plants_plant_alt(),
          caption: m.plants_plant_caption(),
          width: 1200,
          height: 800,
        },
        {
          src: "assets/plants/tree.webp",
          alt: m.plants_tree_alt(),
          caption: m.plants_tree_caption(),
          width: 1200,
          height: 800,
        },
      ],
    },
    {
      id: "plants-forms",
      title: m.plants_forms_title(),
      paragraphs: [m.plants_forms_body()],
      images: [
        {
          src: "assets/plants/flower.webp",
          alt: m.plants_flower_alt(),
          caption: m.plants_flower_caption(),
          width: 1200,
          height: 800,
        },
        {
          src: "assets/plants/hilbert.webp",
          alt: m.plants_hilbert_alt(),
          caption: m.plants_hilbert_caption(),
          width: 1200,
          height: 800,
        },
      ],
    },
    {
      id: "plants-experiment",
      title: m.plants_experiment_title(),
      paragraphs: [m.plants_experiment_body(), m.plants_limits_body()],
      images: [],
    },
  ]
}

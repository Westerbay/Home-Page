import { z } from "zod"
import * as m from "@workspace/i18n/messages"

const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  origin: z.enum(["academic", "personal"]),
  category: z.enum(["games", "generative", "engineering"]),
  image: z.string().nullable(),
  imageCaption: z.string().optional(),
  repository: z.url(),
  demo: z.url().optional(),
  tags: z.array(z.string()),
  summary: z.string(),
  detail: z.string(),
  focus: z.string(),
  focusTitle: z.string().optional(),
})
export type Project = z.infer<typeof projectSchema>

// Titles are shared between the French and English pages.
const projectTitleCollator = new Intl.Collator("en", { sensitivity: "base" })

export function getProjects(): Project[] {
  const projects = z.array(projectSchema).parse([
    {
      slug: "booster-break",
      origin: "personal",
      title: "Booster Break",
      category: "games",
      image: "assets/booster-break/packs.webp",
      repository: "https://github.com/Westerbay/Booster-Break",
      demo: "https://booster.mathis-db.com/",
      tags: ["TypeScript", "React", "WebGL", "Bun", "Elysia", "PostgreSQL"],
      summary: m.booster_summary(),
      detail: m.booster_detail(),
      focus: m.booster_focus(),
      focusTitle: m.booster_focus_title(),
    },
    {
      slug: "spellwar",
      origin: "academic",
      title: "SpellWar",
      category: "games",
      image: "assets/spellwar/gameplay.webp",
      repository: "https://github.com/Westerbay/SpellWar",
      tags: ["C++", "OpenGL", "GLSL", "PBR"],
      summary: m.spellwar_summary(),
      detail: m.spellwar_detail(),
      focus: m.spellwar_focus(),
    },
    {
      slug: "plants",
      origin: "academic",
      title: "The Algorithmic Beauty of Plants",
      category: "generative",
      image: "assets/plants-render.webp",
      repository:
        "https://github.com/Westerbay/The-Algorithmic-Beauty-of-Plants",
      tags: ["WebGL", "L-systems"],
      summary: m.plants_summary(),
      detail: m.plants_detail(),
      focus: m.plants_focus(),
    },
    {
      slug: "stylegan-cheap-dit",
      origin: "academic",
      title: "StyleGAN & Cheap DiT",
      category: "engineering",
      image: "assets/stylegan-cheap-dit/cover.webp",
      imageCaption: m.dit_cover_caption(),
      repository: "https://github.com/Westerbay/StyleGan-and-Cheap-DiT",
      tags: ["Python", "PyTorch", "StyleGAN", "DiT", "VAE", "Docker"],
      summary: m.dit_summary(),
      detail: m.dit_detail(),
      focus: m.dit_focus(),
      focusTitle: m.dit_focus_title(),
    },
    {
      slug: "pinnacle",
      origin: "academic",
      title: "PINNacle",
      category: "engineering",
      image: "assets/pinnacle/cover.webp",
      imageCaption: m.pinnacle_visual_caption(),
      repository: "https://github.com/HadrienNU/PINNacle/tree/setup",
      tags: ["Python", "PyTorch", "C++", "OpenGL", "PINNs"],
      summary: m.pinnacle_summary(),
      detail: m.pinnacle_detail(),
      focus: m.pinnacle_focus(),
      focusTitle: m.pinnacle_focus_title(),
    },
    {
      slug: "eyefox",
      origin: "academic",
      title: "Eyefox Puzzle",
      category: "games",
      image: "assets/eyefox.png",
      repository: "https://github.com/Westerbay/Eyefox-Puzzle",
      tags: ["Java", "Android"],
      summary: m.eyefox_summary(),
      detail: m.eyefox_detail(),
      focus: m.eyefox_focus(),
    },
  ])
  return projects.sort((left, right) =>
    projectTitleCollator.compare(left.title, right.title)
  )
}

export const categoryName = (category: Project["category"]) =>
  ({
    games: m.games(),
    generative: m.generative(),
    engineering: m.engineering(),
  })[category]

export const projectOriginName = (origin: Project["origin"]) =>
  ({
    academic: m.academic_project(),
    personal: m.personal_project(),
  })[origin]

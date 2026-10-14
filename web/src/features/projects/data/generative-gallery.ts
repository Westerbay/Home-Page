export const diffusionSamples = [
  ...[200, 230].flatMap((epoch) =>
    Array.from({ length: epoch === 200 ? 8 : 7 }, (_, index) => ({
      id: String((epoch === 200 ? 0 : 8) + index + 1).padStart(2, "0"),
      image: `assets/stylegan-cheap-dit/dit-epoch-${epoch}-${String(index + 1).padStart(2, "0")}.webp`,
    }))
  ),
  { id: "16", image: "assets/stylegan-cheap-dit/dit-seed-20261020.webp" },
]

export const denoisingSteps = [1, 200, 400, 600, 800, 1000].map((step) => ({
  step,
  image: `assets/stylegan-cheap-dit/step-${String(step).padStart(4, "0")}.webp`,
}))

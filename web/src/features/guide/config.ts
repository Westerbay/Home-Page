import { guideEndpoint } from "./protocol"

export const GUIDE_ENDPOINT = guideEndpoint(
  import.meta.env.VITE_GUIDE_ENABLED,
  import.meta.env.VITE_GUIDE_URL
)
export const GUIDE_ENABLED = GUIDE_ENDPOINT !== null

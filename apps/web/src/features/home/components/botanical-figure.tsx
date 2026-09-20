import { Link } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"
import * as m from "@workspace/i18n/messages"
import { LSystemScene } from "../../lsystem/components/lsystem-scene"

export function BotanicalFigure() {
  return (
    <figure className="atlas-art">
      <div className="botanical-stage">
        <LSystemScene controls="compact" />
      </div>
      <figcaption className="botanical-caption">
        <span>{m.visual_exploration()}</span>
        <Link to="/projects/$slug/" params={{ slug: "plants" }}>
          The Algorithmic Beauty of Plants
          <ArrowUpRight size={18} />
        </Link>
      </figcaption>
    </figure>
  )
}

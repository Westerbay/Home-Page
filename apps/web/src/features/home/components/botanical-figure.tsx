import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowUpRight, RotateCw } from "lucide-react"
import * as m from "@workspace/i18n/messages"
import { Botanical } from "./botanical"

export function BotanicalFigure() {
  const [variation, setVariation] = useState(0)

  return (
    <figure className="atlas-art">
      <div className="botanical-header">
        <span>L-SYSTEMS</span>
        <span aria-hidden="true">
          FIG. {String(variation + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="botanical-stage" aria-hidden="true">
        <Botanical variation={variation} key={variation} />
      </div>
      <div className="botanical-controls">
        <span id="plant-hint">{m.plant_hint()}</span>
        <button
          type="button"
          className="plant-button"
          aria-describedby="plant-hint"
          onClick={() => setVariation((value) => value + 1)}
        >
          <RotateCw size={15} />
          {m.plant_play()}
        </button>
      </div>
      <span
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {variation > 0 ? `${m.plant_changed()} ${variation + 1}` : ""}
      </span>
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

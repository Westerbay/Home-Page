import * as m from "@workspace/i18n/messages"
import { assetUrl } from "../lib/assets"

export function SchoolMention() {
  return (
    <div className="school-mention">
      <span className="school-logo">
        <img
          src={assetUrl("assets/ensicaen.webp")}
          alt=""
          width="128"
          height="124"
        />
      </span>
      <span>
        <span className="school-degree">{m.degree_label()}</span>
        <span className="school-name">ENSICAEN</span>
      </span>
    </div>
  )
}

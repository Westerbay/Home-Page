import * as m from "@workspace/i18n/messages"
import { assetUrl } from "../lib/assets"

export function SchoolMention() {
  return (
    <div className="school-mention">
      <span className="school-logo">
        <img
          src={assetUrl("assets/ensicaen.png")}
          alt=""
          width="1200"
          height="1161"
        />
      </span>
      <span>
        <span className="school-degree">{m.degree_label()}</span>
        <span className="school-name">ENSICAEN</span>
      </span>
    </div>
  )
}

import * as m from "@workspace/i18n/messages"
import { Link } from "@tanstack/react-router"

export function NotFound() {
  return (
    <div className="inner-page">
      <h1>{m.not_found()}</h1>
      <Link to="/">{m.return_home()}</Link>
    </div>
  )
}

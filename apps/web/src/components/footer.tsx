import * as m from "@workspace/i18n/messages"
import { Link } from "@tanstack/react-router"

import { ArrowUpRight } from "lucide-react"
import profile from "@workspace/config/profile" with { type: "json" }

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <span>{profile.name}</span>
        <span>{m.footer()}</span>
      </div>
      <div>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
          <ArrowUpRight size={13} />
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
          <ArrowUpRight size={13} />
        </a>
        <Link to="/contact/">
          {m.contact()}
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </footer>
  )
}

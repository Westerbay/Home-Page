import * as m from "@workspace/i18n/messages"
import { Link } from "@tanstack/react-router"

import { ArrowUpRight } from "lucide-react"
import profile from "@workspace/config/profile" with { type: "json" }

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-name">{profile.name}</p>
      <ul className="footer-links" role="list">
        <li>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </li>
        <li>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </li>
        <li>
          <Link to="/contact/">
            {m.contact()}
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </footer>
  )
}

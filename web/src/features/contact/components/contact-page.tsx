import * as m from "@workspace/i18n/messages"
import { useState } from "react"
import {
  ArrowUpRight,
  Check,
  Copy,
  CodeXml as Github,
  BriefcaseBusiness as Linkedin,
} from "lucide-react"
import { toast } from "sonner"
import profile from "@workspace/config/profile" with { type: "json" }

export function ContactPage() {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.github)
      setCopied(true)
      toast.success(m.copied())
    } catch {
      toast.error(m.copy_error())
    }
  }
  return (
    <section className="inner-page contact-page">
      <div className="page-heading">
        <p className="eyebrow">03 / {m.contact()}</p>
        <h1>{m.contact_title()}</h1>
        <p>{m.contact_body()}</p>
      </div>
      <div className="contact-links">
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          <Linkedin size={25} />
          <span>
            <strong>LinkedIn</strong>
            <span>Mathis Dubuisson</span>
          </span>
          <ArrowUpRight size={24} />
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          <Github size={25} />
          <span>
            <strong>GitHub / Westerbay</strong>
            <span>{m.personal_github()}</span>
          </span>
          <ArrowUpRight size={24} />
        </a>
      </div>
      <button className="text-action copy-button" type="button" onClick={copy}>
        {copied ? <Check size={17} /> : <Copy size={17} />}
        {m.copy_link()}
      </button>
    </section>
  )
}

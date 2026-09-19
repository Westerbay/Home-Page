import * as m from "@workspace/i18n/messages"
import profile from "@workspace/config/profile" with { type: "json" }
import { assetUrl } from "../../../lib/assets"

export function AboutPage() {
  const steps = [
    { title: m.approach_1_title(), body: m.approach_1_body() },
    { title: m.approach_2_title(), body: m.approach_2_body() },
    { title: m.approach_3_title(), body: m.approach_3_body() },
  ]
  return (
    <section className="inner-page about-page">
      <div className="page-heading">
        <p className="eyebrow">02 / {m.about()}</p>
        <h1>{m.about_title()}</h1>
      </div>
      <div className="about-content">
        <div className="profile-portrait">
          <img src={assetUrl(profile.avatar)} alt={m.profile_alt()} />
          <span>Mathis Dubuisson</span>
          <p>{m.degree()}</p>
        </div>
        <div className="about-prose">
          <p className="lead">{m.about_intro()}</p>
          <p>{m.about_body()}</p>
          <p>{m.about_outro()}</p>
        </div>
      </div>
      <section className="approach-section">
        <h2>{m.approach()}</h2>
        <div className="approach-steps">
          {steps.map((step, index) => (
            <div key={index}>
              <span>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

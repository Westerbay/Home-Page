import * as m from "@workspace/i18n/messages"
import { assetUrl } from "../../../lib/assets"
import { JourneyTree } from "./journey-tree"
import { SchoolMention } from "../../../components/school-mention"

export function AboutPage() {
  const steps = [
    { title: m.approach_1_title(), body: m.approach_1_body() },
    { title: m.approach_2_title(), body: m.approach_2_body() },
    { title: m.approach_3_title(), body: m.approach_3_body() },
  ]
  return (
    <article className="inner-page about-page">
      <header className="page-heading">
        <p className="eyebrow">02 / {m.about()}</p>
        <h1>{m.about_title()}</h1>
      </header>
      <div className="about-content">
        <section className="about-personal" aria-labelledby="personal-title">
          <img
            src={assetUrl("assets/about/grand-piano.webp")}
            alt=""
            width="1254"
            height="1254"
          />
          <h2 id="personal-title">{m.about_personal_title()}</h2>
          <p>{m.about_personal_body()}</p>
        </section>
        <div className="about-prose">
          <p className="lead">{m.about_intro()}</p>
          <SchoolMention />
          <p>{m.about_body()}</p>
          <p>{m.about_outro()}</p>
        </div>
      </div>
      <section className="approach-section" aria-labelledby="approach-title">
        <h2 id="approach-title">{m.approach()}</h2>
        <ul className="approach-steps" role="list">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span aria-hidden="true">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ul>
      </section>
      <JourneyTree />
    </article>
  )
}

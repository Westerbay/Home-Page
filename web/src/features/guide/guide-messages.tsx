import * as m from "@workspace/i18n/messages"
import Markdown from "react-markdown"
import type { Components } from "react-markdown"
import { useGuide } from "./guide-provider"
import { safeMarkdownUrl } from "./sources"
import { textOf } from "./protocol"

const markdownComponents: Components = {
  img: () => null,
  a: function SafeLink({ href, children }) {
    if (!href) return <span>{children}</span>
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
}
const accessibleMarkdownComponents: Components = {
  ...markdownComponents,
  a: function PlainLink({ children }) {
    return <span>{children}</span>
  },
}

export function GuideMessages() {
  const { messages, state } = useGuide()
  const items = messages
    .filter((message) => textOf(message).length > 0)
    .map((message) => {
      const text = textOf(message)
      const reveal =
        state.reveal?.messageId === message.id ? state.reveal : null
      const displayedText = reveal
        ? text.slice(0, reveal.visibleCharacters)
        : text
      return (
        <article
          className={`guide-message guide-message-${message.role}`}
          key={message.id}
        >
          <p className="guide-message-author">
            {message.role === "user" ? m.guide_you() : m.guide_title()}
          </p>
          {reveal && (
            <div className="guide-sr-only">
              <Markdown
                skipHtml
                components={accessibleMarkdownComponents}
                urlTransform={safeMarkdownUrl}
              >
                {text}
              </Markdown>
            </div>
          )}
          <div
            className="guide-markdown"
            aria-live={reveal ? "off" : undefined}
            aria-hidden={Boolean(reveal) || undefined}
            inert={Boolean(reveal)}
          >
            <Markdown
              skipHtml
              components={markdownComponents}
              urlTransform={safeMarkdownUrl}
            >
              {displayedText}
            </Markdown>
          </div>
        </article>
      )
    })
  return (
    <div
      className="guide-messages"
      role="log"
      aria-label={m.guide_conversation()}
      aria-live="polite"
      aria-relevant="additions"
    >
      {items}
    </div>
  )
}

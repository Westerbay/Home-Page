import * as m from "@workspace/i18n/messages"
import { useId } from "react"
import type { ReactNode } from "react"
import Markdown from "react-markdown"
import type { Components } from "react-markdown"
import { useGuide } from "./guide-provider"
import { safeMarkdownUrl } from "./sources"
import { textOf } from "./protocol"

function MessageHeading({ children }: { children?: ReactNode }) {
  return (
    <p className="guide-message-heading">
      <strong>{children}</strong>
    </p>
  )
}

const markdownComponents: Components = {
  img: () => null,
  h1: MessageHeading,
  h2: MessageHeading,
  h3: MessageHeading,
  h4: MessageHeading,
  h5: MessageHeading,
  h6: MessageHeading,
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

export function GuideMessageItems() {
  const { messages, state } = useGuide()
  const id = useId()
  const items = messages
    .filter((message) => textOf(message).length > 0)
    .map((message) => {
      const text = textOf(message)
      const reveal =
        state.reveal?.messageId === message.id ? state.reveal : null
      const streaming = state.streamingMessageId === message.id
      const displayedText = reveal
        ? text.slice(0, reveal.visibleCharacters)
        : text
      const authorId = `${id}-${encodeURIComponent(message.id)}-author`
      return (
        <li key={message.id}>
          <article
            className={`guide-message guide-message-${message.role}`}
            aria-labelledby={authorId}
            aria-busy={streaming || undefined}
          >
            <header>
              <p className="guide-message-author" id={authorId}>
                {message.role === "user" ? m.guide_you() : m.guide_title()}
              </p>
            </header>
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
        </li>
      )
    })
  if (items.length === 0) return null
  return (
    <ol className="guide-message-list" role="list">
      {items}
    </ol>
  )
}

import { useCallback, useState } from "react"
import { assetUrl } from "../../../lib/assets"
import type { ProjectStoryVideo } from "../data/project-stories"

export function StoryVideo({
  video,
  captionId,
}: {
  video: ProjectStoryVideo
  captionId: string
}) {
  const [ready, setReady] = useState(false)
  const observeVideo = useCallback((element: HTMLVideoElement | null) => {
    if (!element) return
    if (typeof IntersectionObserver === "undefined") {
      setReady(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setReady(true)
      },
      { rootMargin: "160px" }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={observeVideo}
      src={assetUrl(video.src)}
      poster={assetUrl(video.poster)}
      width={video.width}
      height={video.height}
      aria-label={video.description}
      aria-describedby={captionId}
      controls
      playsInline
      muted
      autoPlay={ready}
      loop
      preload={ready ? "auto" : "none"}
    >
      <a href={assetUrl(video.src)}>{video.caption}</a>
    </video>
  )
}

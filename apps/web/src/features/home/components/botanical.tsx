import type { ReactNode } from "react"

export function Botanical({ variation = 0 }: { variation?: number }) {
  const branches: ReactNode[] = []
  // Fixed arithmetic keeps the initial server and browser renders identical.
  const turn = variation % 12
  const spread = 22 + ((turn * 7) % 16)

  function grow(
    x: number,
    y: number,
    length: number,
    angle: number,
    level: number,
    seed: number
  ) {
    if (!level) return
    const rad = (angle * Math.PI) / 180
    const endX = x + Math.cos(rad) * length
    const endY = y + Math.sin(rad) * length
    branches.push(
      <path
        key={seed}
        d={`M${x},${y} Q${x + Math.cos(rad + 0.12) * length * 0.5},${y + Math.sin(rad + 0.12) * length * 0.5} ${endX},${endY}`}
        strokeWidth={Math.max(0.7, level * 0.52)}
      />
    )
    if (level <= 3)
      branches.push(
        <ellipse
          key={`l${seed}`}
          cx={endX}
          cy={endY}
          rx={3 + level + (turn % 3)}
          ry={10 + level * 2 - (turn % 4)}
          transform={`rotate(${angle + 90} ${endX} ${endY})`}
          fill="currentColor"
          stroke="none"
          opacity=".72"
        />
      )
    grow(
      endX,
      endY,
      length * 0.76,
      angle - spread - (seed % 9),
      level - 1,
      seed * 2
    )
    grow(
      endX,
      endY,
      length * 0.72,
      angle + spread + 5 + (seed % 7),
      level - 1,
      seed * 2 + 1
    )
  }

  grow(265, 447, 90 + (turn % 4) * 2, -90 + ((turn % 3) - 1) * 3, 7, 1)
  return (
    <svg
      className={variation > 0 ? "botanical is-regenerated" : "botanical"}
      viewBox="35 100 450 380"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeLinecap="round">
        {branches}
      </g>
      <path d="M170 465H360" stroke="currentColor" opacity=".35" />
    </svg>
  )
}

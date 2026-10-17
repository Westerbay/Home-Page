import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

export function Toaster({
  position = "bottom-right",
}: {
  position?: ToasterProps["position"]
}) {
  const { resolvedTheme } = useTheme()
  return (
    <Sonner
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position={position}
      richColors
    />
  )
}

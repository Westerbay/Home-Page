import type { ComponentProps } from "react"
import { Slot } from "radix-ui"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const buttonVariants = cva("button", {
  variants: {
    variant: {
      default: "button-primary",
      ghost: "button-ghost",
      outline: "button-outline",
    },
    size: { default: "button-default", icon: "button-icon" },
  },
  defaultVariants: { variant: "default", size: "default" },
})
export function Button({
  className,
  variant,
  size,
  asChild = false,
  type = "button",
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot.Root : "button"
  return (
    <Component
      {...(!asChild ? { type } : {})}
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

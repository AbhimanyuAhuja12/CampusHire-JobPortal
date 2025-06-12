import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: "left" | "center" | "right"
  className?: string
  children?: ReactNode
}

export function SectionHeading({ title, subtitle, align = "center", className, children }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-4 mb-12",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className,
      )}
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{subtitle}</p>}
      {children}
    </div>
  )
}

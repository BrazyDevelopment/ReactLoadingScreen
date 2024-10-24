import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "../../lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden bg-background border-2 border-transparent outline outline-red-500",
      className
    )}
    {...props}
  >
        <ProgressPrimitive.Indicator
           className="h-full w-full bg-red-500 transition-all"
           style={{ width: `${value}%` }}
       />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
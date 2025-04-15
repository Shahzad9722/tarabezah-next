import * as React from "react"

import { cn } from "@/app/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {

    return (
      <input
        type={type}
        min={0}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-color-222036 px-3 border-color-222036 py-2 text-base ring-offset-background text-color-E9E3D7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        onKeyDown={(e) => {
          if (e.key === '-' || e.key === 'e') {
            e.preventDefault();
          }
        }}
        onInput={(e) => {
          const input = e.target as HTMLInputElement;
          if (Number(input.value) < 0) {
            input.value = '0';
          }
        }}
        ref={ref}
        {...props}
        maxLength={props.maxLength}
      />

    )
  }
)
Input.displayName = "Input"

export { Input }
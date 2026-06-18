import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SeparatorProps = HTMLAttributes<HTMLHRElement> & {
  orientation?: "horizontal" | "vertical";
};

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  if (orientation === "vertical") {
    return (
      <div
        aria-orientation="vertical"
        className={cn("h-full w-px shrink-0 bg-border", className)}
        {...(props as HTMLAttributes<HTMLDivElement>)}
      />
    );
  }

  return (
    <hr
      className={cn("h-px w-full shrink-0 border-0 bg-border", className)}
      {...props}
    />
  );
}

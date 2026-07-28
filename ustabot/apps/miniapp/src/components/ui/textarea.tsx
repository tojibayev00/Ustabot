import * as React from "react";
import { cn } from "@/utils/cn.js";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full min-h-24 rounded-md border bg-section-bg px-3.5 py-2.5 text-[15px] text-text placeholder:text-hint",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-danger" : "border-hint/25",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };

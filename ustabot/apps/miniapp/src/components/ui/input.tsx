import * as React from "react";
import { cn } from "@/utils/cn.js";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border bg-section-bg px-3.5 text-[15px] text-text placeholder:text-hint",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-danger" : "border-hint/25",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };

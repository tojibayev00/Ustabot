import { cn } from "@/utils/cn.js";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div className={cn("skeleton animate-shimmer rounded-md", className)} {...props} />;
}

export { Skeleton };

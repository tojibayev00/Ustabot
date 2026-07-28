import { Check } from "lucide-react";
import { cn } from "@/utils/cn.js";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps): JSX.Element {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={label} className="flex flex-1 items-center gap-1.5">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                isDone && "bg-success text-white",
                isActive && !isDone && "bg-link text-white",
                !isDone && !isActive && "bg-secondary-bg text-hint"
              )}
            >
              {isDone ? <Check className="h-4 w-4" /> : stepNumber}
            </div>
            {index < steps.length - 1 && (
              <div className={cn("h-0.5 flex-1 rounded", isDone ? "bg-success" : "bg-secondary-bg")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

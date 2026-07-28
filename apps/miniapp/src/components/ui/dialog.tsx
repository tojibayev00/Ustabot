import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/utils/cn.js";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

function DialogOverlay({ className, ...props }: DialogPrimitive.DialogOverlayProps): JSX.Element {
  return (
    <DialogPrimitive.Overlay
      className={cn("fixed inset-0 z-50 bg-black/50 animate-fade-in", className)}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: DialogPrimitive.DialogContentProps): JSX.Element {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-x-4 bottom-[max(env(safe-area-inset-bottom),16px)] z-50 rounded-lg bg-section-bg p-4 shadow-soft-lg animate-slide-up",
          "sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-3 top-3 rounded-full p-1.5 text-hint hover:bg-secondary-bg">
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div className={cn("mb-3 space-y-1 pr-6", className)} {...props} />;
}

function DialogTitle({ className, ...props }: DialogPrimitive.DialogTitleProps): JSX.Element {
  return <DialogPrimitive.Title className={cn("text-base font-semibold text-text", className)} {...props} />;
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.DialogDescriptionProps): JSX.Element {
  return <DialogPrimitive.Description className={cn("text-sm text-hint", className)} {...props} />;
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription };

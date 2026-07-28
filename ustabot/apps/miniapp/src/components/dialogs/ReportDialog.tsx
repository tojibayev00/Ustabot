import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Textarea } from "@/components/ui/textarea.js";
import { reportApi } from "@/services/api.service.js";
import { ApiError } from "@/services/http.js";

const reportSchema = z.object({
  reason: z.string().trim().min(3, "Sabab kamida 3 belgidan iborat bo'lishi kerak").max(200),
  description: z.string().trim().max(1000).optional()
});
type ReportForm = z.infer<typeof reportSchema>;

interface ReportDialogProps {
  workerId: string;
  trigger: React.ReactNode;
}

export function ReportDialog({ workerId, trigger }: ReportDialogProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReportForm>({ resolver: zodResolver(reportSchema) });

  const mutation = useMutation({
    mutationFn: (data: ReportForm) => reportApi.create({ workerId, ...data }),
    onSuccess: () => setSubmitted(true),
    onError: (error) => setSubmitError(error instanceof ApiError ? error.message : "Xatolik yuz berdi")
  });

  function handleOpenChange(next: boolean): void {
    setOpen(next);
    if (!next) {
      reset();
      setSubmitError(null);
      setSubmitted(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <DialogContent>
        {submitted ? (
          <div className="space-y-2 py-2 text-center">
            <p className="text-[15px] font-medium text-text">Shikoyatingiz qabul qilindi</p>
            <p className="text-sm text-hint">Tez orada ko'rib chiqiladi. Rahmat!</p>
            <Button size="sm" onClick={() => handleOpenChange(false)} className="mt-2">
              Yopish
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-danger" /> Shikoyat yozish
              </DialogTitle>
              <DialogDescription>Nima uchun bu usta profilidan shikoyat qilyapsiz?</DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit((data) => mutation.mutate(data))}
              className="space-y-3"
            >
              <div>
                <Input placeholder="Sabab (masalan: soxta profil)" {...register("reason")} />
                {errors.reason && <p className="mt-1 text-xs text-danger">{errors.reason.message}</p>}
              </div>
              <Textarea placeholder="Qo'shimcha izoh (ixtiyoriy)" {...register("description")} />

              {submitError && <p className="text-xs text-danger">{submitError}</p>}

              <Button type="submit" isLoading={mutation.isPending} className="w-full">
                Yuborish
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/auth.store.js";
import { workerApi } from "@/services/api.service.js";
import { ApiError } from "@/services/http.js";
import { isValidUzbekPhone } from "@/utils/phone.js";
import { StepIndicator } from "@/components/forms/StepIndicator.js";
import { PersonalInfoStep } from "@/components/forms/steps/PersonalInfoStep.js";
import { LocationStep } from "@/components/forms/steps/LocationStep.js";
import { ProfessionalInfoStep } from "@/components/forms/steps/ProfessionalInfoStep.js";
import { ReviewStep } from "@/components/forms/steps/ReviewStep.js";
import { INITIAL_WIZARD_DATA, type WizardFormData, type WizardFieldUpdater } from "@/components/forms/steps/wizard.types.js";
import { Button } from "@/components/ui/button.js";
import { FullScreenLoader } from "@/components/common/LoadingSpinner.js";
import { WorkerStatusCard } from "@/components/worker/WorkerStatusCard.js";
import { CheckCircle2 } from "lucide-react";

const STEP_LABELS = ["Shaxsiy", "Manzil", "Kasbiy", "Tekshirish"];
const TOTAL_STEPS = STEP_LABELS.length;

function validateStep(
  step: number,
  data: WizardFormData
): Partial<Record<keyof WizardFormData, string>> {
  const errors: Partial<Record<keyof WizardFormData, string>> = {};

  if (step === 1) {
    if (data.firstName.trim().length < 2) errors.firstName = "Kamida 2 belgi";
    if (data.lastName.trim().length < 2) errors.lastName = "Kamida 2 belgi";
    const age = Number(data.age);
    if (!age || age < 18 || age > 100) errors.age = "18 dan 100 gacha bo'lishi kerak";
    if (!isValidUzbekPhone(data.phone)) errors.phone = "Telefon raqam noto'g'ri";
  }

  if (step === 2) {
    if (!data.regionId) errors.regionId = "Viloyatni tanlang";
    if (!data.districtId) errors.districtId = "Tumanni tanlang";
    if (data.address.trim().length < 5) errors.address = "Manzilni to'liq kiriting";
    if (!data.latitude || !data.longitude) errors.latitude = "Joylashuvni aniqlang";
  }

  if (step === 3) {
    if (!data.categoryId) errors.categoryId = "Kategoriyani tanlang";
    const exp = Number(data.experienceYears);
    if (data.experienceYears === "" || exp < 0) errors.experienceYears = "Tajribani kiriting";
    if (data.description.trim().length < 20) errors.description = "Kamida 20 belgi";
    if (data.images.length < 3) errors.images = "Kamida 3 ta rasm yuklang";
  }

  if (step === 4) {
    if (!data.acceptedTerms) errors.acceptedTerms = "Shartlarga rozilik bildiring";
  }

  return errors;
}

function RegistrationWizard(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardFormData>(INITIAL_WIZARD_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof WizardFormData, string>>>({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update: WizardFieldUpdater = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("firstName", data.firstName.trim());
      formData.append("lastName", data.lastName.trim());
      formData.append("age", data.age);
      formData.append("phone", data.phone.trim());
      if (data.telegramUsername) formData.append("telegramUsername", data.telegramUsername.trim());
      formData.append("categoryId", data.categoryId);
      formData.append("regionId", data.regionId);
      formData.append("districtId", data.districtId);
      if (data.villageId) formData.append("villageId", data.villageId);
      formData.append("description", data.description.trim());
      formData.append("experienceYears", data.experienceYears);
      formData.append("address", data.address.trim());
      formData.append("latitude", data.latitude);
      formData.append("longitude", data.longitude);
      formData.append("workingHoursStart", data.workingHoursStart);
      formData.append("workingHoursEnd", data.workingHoursEnd);
      for (const file of data.images) formData.append("images", file);

      return workerApi.register(formData);
    },
    onSuccess: () => {
      setSuccess(true);
      void queryClient.invalidateQueries({ queryKey: ["worker-status"] });
      useAuthStore.getState().updateUser({ isWorker: true });
    },
    onError: (error) => {
      setSubmitError(error instanceof ApiError ? error.message : "Xatolik yuz berdi");
    }
  });

  function goNext(): void {
    const stepErrors = validateStep(step, data);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    if (step === TOTAL_STEPS) {
      mutation.mutate();
      return;
    }
    setStep((s) => s + 1);
  }

  function goBack(): void {
    if (step === 1) {
      navigate(-1);
      return;
    }
    setStep((s) => s - 1);
  }

  if (success) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 px-6 text-center">
        <CheckCircle2 className="h-16 w-16 text-success" />
        <p className="text-[17px] font-semibold text-text">Arizangiz qabul qilindi!</p>
        <p className="text-sm text-hint">
          Moderatsiyadan so'ng profilingiz qidiruvda ko'rinadi. Odatda bu 24 soatgacha vaqt oladi.
        </p>
        <Button onClick={() => navigate("/profile")} className="mt-2">
          Profilimga o'tish
        </Button>
      </div>
    );
  }

  const stepProps = { data, update, errors };

  return (
    <div className="pb-24">
      <StepIndicator steps={STEP_LABELS} currentStep={step} />

      <div className="px-4">
        {step === 1 && <PersonalInfoStep {...stepProps} />}
        {step === 2 && <LocationStep {...stepProps} />}
        {step === 3 && <ProfessionalInfoStep {...stepProps} />}
        {step === 4 && <ReviewStep {...stepProps} />}

        {submitError && <p className="mt-3 text-sm text-danger">{submitError}</p>}
      </div>

      <div className="fixed inset-x-0 bottom-0 flex gap-2 border-t border-hint/10 bg-header-bg p-3 pb-[max(env(safe-area-inset-bottom),12px)]">
        <Button variant="secondary" onClick={goBack} className="flex-1">
          <ChevronLeft className="h-4 w-4" /> Orqaga
        </Button>
        <Button onClick={goNext} isLoading={mutation.isPending} className="flex-1">
          {step === TOTAL_STEPS ? "Yuborish" : "Keyingi"}
          {step !== TOTAL_STEPS && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

export default function BecomeWorkerPage(): JSX.Element {
  const user = useAuthStore((s) => s.user);

  const statusQuery = useQuery({
    queryKey: ["worker-status"],
    queryFn: workerApi.getMyStatus,
    enabled: Boolean(user?.isWorker)
  });

  if (user?.isWorker) {
    if (statusQuery.isLoading) return <FullScreenLoader />;
    if (statusQuery.data) return <WorkerStatusCard status={statusQuery.data} />;
  }

  return <RegistrationWizard />;
}

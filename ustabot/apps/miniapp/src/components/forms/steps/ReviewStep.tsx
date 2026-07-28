import { useCategories } from "@/hooks/useCategories.js";
import { useRegions, useDistricts } from "@/hooks/useRegions.js";
import type { WizardFormData, WizardFieldUpdater } from "@/components/forms/steps/wizard.types.js";

interface StepProps {
  data: WizardFormData;
  update: WizardFieldUpdater;
  errors: Partial<Record<keyof WizardFormData, string>>;
}

function ReviewRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex justify-between gap-3 border-b border-hint/10 py-2 text-sm last:border-0">
      <span className="text-hint">{label}</span>
      <span className="text-right font-medium text-text">{value || "—"}</span>
    </div>
  );
}

export function ReviewStep({ data, update, errors }: StepProps): JSX.Element {
  const categories = useCategories();
  const regions = useRegions();
  const districts = useDistricts(data.regionId || undefined);

  const categoryName = categories.data?.find((c) => c.id === data.categoryId)?.name ?? "";
  const regionName = regions.data?.find((r) => r.id === data.regionId)?.name ?? "";
  const districtName = districts.data?.find((d) => d.id === data.districtId)?.name ?? "";

  return (
    <div className="space-y-4">
      <h2 className="text-[15px] font-semibold text-text">Ma'lumotlarni tekshiring</h2>

      <div className="rounded-md bg-section-bg p-3 shadow-soft">
        <ReviewRow label="Ism familiya" value={`${data.firstName} ${data.lastName}`} />
        <ReviewRow label="Yosh" value={data.age} />
        <ReviewRow label="Telefon" value={data.phone} />
        <ReviewRow label="Kategoriya" value={categoryName} />
        <ReviewRow label="Manzil" value={`${regionName}, ${districtName}`} />
        <ReviewRow label="Tajriba" value={`${data.experienceYears} yil`} />
        <ReviewRow label="Ish vaqti" value={`${data.workingHoursStart}–${data.workingHoursEnd}`} />
        <ReviewRow label="Rasmlar" value={`${data.images.length} ta`} />
      </div>

      <label className="flex items-start gap-2.5 text-sm text-text">
        <input
          type="checkbox"
          checked={data.acceptedTerms}
          onChange={(e) => update("acceptedTerms", e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-hint/40"
        />
        <span>
          Men <span className="text-link">Foydalanish shartlari</span> va{" "}
          <span className="text-link">Maxfiylik siyosati</span>ga roziman
        </span>
      </label>
      {errors.acceptedTerms && <p className="text-xs text-danger">{errors.acceptedTerms}</p>}
    </div>
  );
}

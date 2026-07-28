import { Input } from "@/components/ui/input.js";
import { Textarea } from "@/components/ui/textarea.js";
import { ImageUploader } from "@/components/forms/ImageUploader.js";
import { useCategories } from "@/hooks/useCategories.js";
import type { WizardFormData, WizardFieldUpdater } from "@/components/forms/steps/wizard.types.js";

interface StepProps {
  data: WizardFormData;
  update: WizardFieldUpdater;
  errors: Partial<Record<keyof WizardFormData, string>>;
}

const selectClass =
  "h-11 w-full rounded-md border border-hint/25 bg-section-bg px-3 text-[15px] text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link/50";

export function ProfessionalInfoStep({ data, update, errors }: StepProps): JSX.Element {
  const categories = useCategories();

  return (
    <div className="space-y-4">
      <h2 className="text-[15px] font-semibold text-text">Kasbiy ma'lumotlar</h2>

      <div>
        <label className="mb-1 block text-xs font-medium text-hint">Kategoriya</label>
        <select
          className={selectClass}
          value={data.categoryId}
          onChange={(e) => update("categoryId", e.target.value)}
        >
          <option value="">Tanlang</option>
          {categories.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="mt-1 text-xs text-danger">{errors.categoryId}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-hint">Tajriba (yil)</label>
        <Input
          type="number"
          inputMode="numeric"
          value={data.experienceYears}
          onChange={(e) => update("experienceYears", e.target.value)}
        />
        {errors.experienceYears && <p className="mt-1 text-xs text-danger">{errors.experienceYears}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-hint">Ish boshlanishi</label>
          <Input
            type="time"
            value={data.workingHoursStart}
            onChange={(e) => update("workingHoursStart", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-hint">Ish tugashi</label>
          <Input
            type="time"
            value={data.workingHoursEnd}
            onChange={(e) => update("workingHoursEnd", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-hint">O'zingiz haqingizda</label>
        <Textarea
          placeholder="Tajribangiz, ko'nikmalaringiz haqida yozing (kamida 20 belgi)..."
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
        />
        <div className="mt-1 flex justify-between text-xs text-hint">
          <span>{errors.description && <span className="text-danger">{errors.description}</span>}</span>
          <span>{data.description.length}/1000</span>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-hint">Portfolio rasmlar</label>
        <ImageUploader files={data.images} onChange={(files) => update("images", files)} />
        {errors.images && <p className="mt-1 text-xs text-danger">{errors.images}</p>}
      </div>
    </div>
  );
}

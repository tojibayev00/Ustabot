import { Input } from "@/components/ui/input.js";
import type { WizardFormData, WizardFieldUpdater } from "@/components/forms/steps/wizard.types.js";

interface StepProps {
  data: WizardFormData;
  update: WizardFieldUpdater;
  errors: Partial<Record<keyof WizardFormData, string>>;
}

export function PersonalInfoStep({ data, update, errors }: StepProps): JSX.Element {
  return (
    <div className="space-y-4">
      <h2 className="text-[15px] font-semibold text-text">Shaxsiy ma'lumotlar</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-hint">Ism</label>
          <Input value={data.firstName} onChange={(e) => update("firstName", e.target.value)} />
          {errors.firstName && <p className="mt-1 text-xs text-danger">{errors.firstName}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-hint">Familiya</label>
          <Input value={data.lastName} onChange={(e) => update("lastName", e.target.value)} />
          {errors.lastName && <p className="mt-1 text-xs text-danger">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-hint">Yosh</label>
        <Input
          type="number"
          inputMode="numeric"
          value={data.age}
          onChange={(e) => update("age", e.target.value)}
        />
        {errors.age && <p className="mt-1 text-xs text-danger">{errors.age}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-hint">Telefon raqam</label>
        <Input
          type="tel"
          placeholder="+998 90 123 45 67"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
        {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-hint">Telegram username (ixtiyoriy)</label>
        <Input
          placeholder="username"
          value={data.telegramUsername}
          onChange={(e) => update("telegramUsername", e.target.value)}
        />
      </div>
    </div>
  );
}

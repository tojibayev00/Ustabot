import { MapPin, LocateFixed } from "lucide-react";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { useRegions, useDistricts, useVillages } from "@/hooks/useRegions.js";
import type { WizardFormData, WizardFieldUpdater } from "@/components/forms/steps/wizard.types.js";

interface StepProps {
  data: WizardFormData;
  update: WizardFieldUpdater;
  errors: Partial<Record<keyof WizardFormData, string>>;
}

const selectClass =
  "h-11 w-full rounded-md border border-hint/25 bg-section-bg px-3 text-[15px] text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link/50";

export function LocationStep({ data, update, errors }: StepProps): JSX.Element {
  const regions = useRegions();
  const districts = useDistricts(data.regionId || undefined);
  const villages = useVillages(data.districtId || undefined);

  function detectLocation(): void {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      update("latitude", String(position.coords.latitude));
      update("longitude", String(position.coords.longitude));
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-[15px] font-semibold text-text">Manzil</h2>

      <div>
        <label className="mb-1 block text-xs font-medium text-hint">Viloyat</label>
        <select
          className={selectClass}
          value={data.regionId}
          onChange={(e) => {
            update("regionId", e.target.value);
            update("districtId", "");
            update("villageId", "");
          }}
        >
          <option value="">Tanlang</option>
          {regions.data?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        {errors.regionId && <p className="mt-1 text-xs text-danger">{errors.regionId}</p>}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-hint">Tuman</label>
        <select
          className={selectClass}
          value={data.districtId}
          disabled={!data.regionId}
          onChange={(e) => {
            update("districtId", e.target.value);
            update("villageId", "");
          }}
        >
          <option value="">Tanlang</option>
          {districts.data?.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        {errors.districtId && <p className="mt-1 text-xs text-danger">{errors.districtId}</p>}
      </div>

      {villages.data && villages.data.length > 0 && (
        <div>
          <label className="mb-1 block text-xs font-medium text-hint">Qishloq (ixtiyoriy)</label>
          <select
            className={selectClass}
            value={data.villageId}
            onChange={(e) => update("villageId", e.target.value)}
          >
            <option value="">Tanlanmagan</option>
            {villages.data.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-hint">To'liq manzil</label>
        <Input
          placeholder="Ko'cha, uy raqami..."
          value={data.address}
          onChange={(e) => update("address", e.target.value)}
        />
        {errors.address && <p className="mt-1 text-xs text-danger">{errors.address}</p>}
      </div>

      <div>
        <Button type="button" variant="outline" size="sm" onClick={detectLocation}>
          <LocateFixed className="h-4 w-4" /> Joriy joylashuvni aniqlash
        </Button>
        {data.latitude && data.longitude && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-hint">
            <MapPin className="h-3.5 w-3.5" />
            {Number(data.latitude).toFixed(5)}, {Number(data.longitude).toFixed(5)}
          </p>
        )}
        {errors.latitude && <p className="mt-1 text-xs text-danger">{errors.latitude}</p>}
      </div>
    </div>
  );
}

import { settingsRepository } from "@/modules/settings/repository/settings.repository.js";
import type { UpdateSettingsInput } from "@/modules/settings/validators/settings.validators.js";
import { getOrSetCache, invalidateCache, CACHE_TTL } from "@/shared/cache.js";
import type { Settings } from "@prisma/client";

const CACHE_KEY = "settings:global";

export const settingsService = {
  async get(): Promise<Settings> {
    return getOrSetCache(CACHE_KEY, CACHE_TTL.SETTINGS, () => settingsRepository.getOrCreate());
  },

  async update(input: UpdateSettingsInput): Promise<Settings> {
    const current = await settingsRepository.getOrCreate();
    const updated = await settingsRepository.update(current.id, input);
    await invalidateCache(CACHE_KEY);
    return updated;
  }
};

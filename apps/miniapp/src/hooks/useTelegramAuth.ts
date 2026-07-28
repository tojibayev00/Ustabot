import { useEffect, useState } from "react";
import { getTelegramWebApp } from "@/types/telegram.types.js";
import { authApi } from "@/services/api.service.js";
import { useAuthStore } from "@/store/auth.store.js";
import { ApiError } from "@/services/http.js";

interface UseTelegramAuthResult {
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Ilova ochilganda bir marta ishga tushadi:
 * Telegram initData'ni backend'ga yuboradi → JWT oladi → auth store'ga saqlaydi.
 * App Startup Flow (Part 6): "Authenticate → Receive JWT → Load Settings → ..."
 */
export function useTelegramAuth(): UseTelegramAuthResult {
  const { setSession, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!isAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function authenticate(): Promise<void> {
      setIsLoading(true);
      setError(null);

      const webApp = getTelegramWebApp();
      const initData = webApp?.initData;

      if (!initData) {
        if (!cancelled) {
          setError("Bu ilova faqat Telegram ichida ishlaydi");
          setIsLoading(false);
        }
        return;
      }

      try {
        const result = await authApi.telegramAuth(initData);
        if (!cancelled) {
          setSession(result.tokens.accessToken, result.tokens.refreshToken, result.user);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : "Autentifikatsiyada xatolik yuz berdi";
          setError(message);
          setIsLoading(false);
        }
      }
    }

    void authenticate();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, isAuthenticated]);

  return { isLoading, error, retry: () => setAttempt((a) => a + 1) };
}

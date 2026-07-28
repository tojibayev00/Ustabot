import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  photoUrl: string | null;
  languageCode: string | null;
  role: "USER" | "WORKER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
  isWorker: boolean;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setSession: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user, isAuthenticated: true }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : state.user
        })),

      clearSession: () =>
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
    }),
    {
      name: "ustalar-auth",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

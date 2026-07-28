import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store.js";
import { userApi, settingsApi } from "@/services/api.service.js";
import { useTelegramBackButton } from "@/hooks/useTelegramBackButton.js";
import { Card } from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog.js";

const LANGUAGES = [
  { code: "uz", label: "O'zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" }
];

export default function SettingsPage(): JSX.Element {
  useTelegramBackButton();
  const { user, updateUser, clearSession } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const settingsQuery = useQuery({ queryKey: ["app-settings"], queryFn: settingsApi.get });

  const updateLanguageMutation = useMutation({
    mutationFn: (languageCode: string) => userApi.updateMe({ languageCode }),
    onSuccess: (_, languageCode) => updateUser({ languageCode })
  });

  const toggleNotificationsMutation = useMutation({
    mutationFn: (enabled: boolean) => userApi.updateMe({ notificationsEnabled: enabled })
  });

  const deleteAccountMutation = useMutation({
    mutationFn: userApi.deleteMe,
    onSuccess: () => clearSession()
  });

  return (
    <div className="space-y-4 pb-8 pt-4">
      <h1 className="px-4 text-lg font-bold text-text">Sozlamalar</h1>

      <div className="px-4">
        <p className="mb-2 text-xs font-medium text-hint">Til</p>
        <Card className="divide-y divide-hint/10">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => updateLanguageMutation.mutate(lang.code)}
              className="flex w-full items-center justify-between px-4 py-3 text-[15px] text-text"
            >
              {lang.label}
              {user?.languageCode === lang.code && <span className="text-link">✓</span>}
            </button>
          ))}
        </Card>
      </div>

      <div className="px-4">
        <p className="mb-2 text-xs font-medium text-hint">Bildirishnomalar</p>
        <Card>
          <label className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[15px] text-text">Push-bildirishnomalar</span>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => {
                setNotificationsEnabled(e.target.checked);
                toggleNotificationsMutation.mutate(e.target.checked);
              }}
              className="h-6 w-11 shrink-0 appearance-none rounded-full bg-secondary-bg checked:bg-link relative transition-colors before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-5"
            />
          </label>
        </Card>
      </div>

      <div className="px-4">
        <p className="mb-2 text-xs font-medium text-hint">Ma'lumot</p>
        <Card className="divide-y divide-hint/10">
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-hint">Versiya</span>
            <span className="text-text">{settingsQuery.data?.appVersion ?? "1.0.0"}</span>
          </div>
        </Card>
      </div>

      <div className="px-4 pt-4">
        <Button variant="ghost" className="w-full text-danger" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 className="h-4 w-4" /> Hisobni o'chirish
        </Button>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hisobni o'chirish</DialogTitle>
            <DialogDescription>
              Bu amalni ortga qaytarib bo'lmaydi. Rostdan ham hisobingizni o'chirmoqchimisiz?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteDialogOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              isLoading={deleteAccountMutation.isPending}
              onClick={() => deleteAccountMutation.mutate()}
            >
              O'chirish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

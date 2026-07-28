import { QueryProvider } from "@/providers/QueryProvider.js";
import { AppRouter } from "@/router/index.js";
import { useTelegramAuth } from "@/hooks/useTelegramAuth.js";
import { FullScreenLoader } from "@/components/common/LoadingSpinner.js";
import { Button } from "@/components/ui/button.js";
import { AlertTriangle } from "lucide-react";

function AuthErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }): JSX.Element {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
        <AlertTriangle className="h-7 w-7 text-danger" strokeWidth={1.5} />
      </div>
      <p className="text-[15px] font-medium text-text">Kirish imkonsiz</p>
      <p className="text-sm text-hint">{message}</p>
      <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
        Qayta urinish
      </Button>
    </div>
  );
}

function AuthGate(): JSX.Element {
  const { isLoading, error, retry } = useTelegramAuth();

  if (isLoading) {
    return <FullScreenLoader label="Yuklanmoqda..." />;
  }

  if (error) {
    return <AuthErrorScreen message={error} onRetry={retry} />;
  }

  return <AppRouter />;
}

export default function App(): JSX.Element {
  return (
    <QueryProvider>
      <AuthGate />
    </QueryProvider>
  );
}

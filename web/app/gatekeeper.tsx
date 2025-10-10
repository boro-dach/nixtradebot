"use client";
import { useTelegramStore, telegramSelectors } from "@/entities/telegram";
import { useUser } from "@/entities/user/api/useUser";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const ErrorScreen = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-background text-center p-4">
    <h1 className="text-2xl font-bold text-destructive mb-2">Ошибка</h1>
    <p className="text-muted-foreground">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
    >
      Попробовать снова
    </button>
  </div>
);

const BannedScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-background text-center p-4">
    <h1 className="text-2xl font-bold text-destructive mb-2">
      Доступ ограничен
    </h1>
    <p className="text-muted-foreground">Ваш аккаунт был заблокирован.</p>
  </div>
);

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
  </div>
);

export const Gatekeeper = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { init, expand } = useTelegramStore();

  //   const userId = useTelegramStore(telegramSelectors.userId);
  const userId = "843961428";

  const { data: user, isLoading, error } = useUser(userId?.toString() || "");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tg = window.Telegram?.WebApp;

      if (tg) {
        console.log("✅ Telegram WebApp found, initializing...");
        init(tg);
        expand();
      } else {
        console.log("⚠️ No Telegram WebApp - running in development mode");
      }

      setIsInitialized(true);
    }
  }, [init, expand]);

  useEffect(() => {
    console.log("🔍 Gatekeeper State:", {
      isInitialized,
      userId,
      isLoading,
      hasError: !!error,
      errorMessage: error?.message,
      hasUser: !!user,
      userBanned: user?.isBannedInBot,
    });
  }, [isInitialized, userId, isLoading, error, user]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!userId) {
    return (
      <ErrorScreen message="Не удалось получить ID пользователя. Откройте приложение через Telegram." />
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    console.error("User fetch error:", error);
    return (
      <ErrorScreen
        message={`Не удалось загрузить данные пользователя. ${
          error instanceof Error ? error.message : ""
        }`}
      />
    );
  }

  if (!user) {
    return (
      <ErrorScreen message="Пользователь не найден. Обратитесь в поддержку." />
    );
  }

  if (user.isBannedInBot) {
    return <BannedScreen />;
  }

  return <>{children}</>;
};

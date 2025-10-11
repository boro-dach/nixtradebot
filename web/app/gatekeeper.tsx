"use-client";

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
  const { init, expand } = useTelegramStore();
  const telegramUserId = useTelegramStore(telegramSelectors.userId);

  // Флаг, который показывает, что TWA точно инициализировался
  const [isTwaReady, setIsTwaReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        init(tg);
        tg.ready();
        expand();
      }
    }
  }, [init, expand]);

  const userId =
    process.env.NODE_ENV === "development"
      ? telegramUserId || 843961428
      : telegramUserId;

  const { data: user, isLoading, error } = useUser(userId);

  // --- ЛОГИКА ОТОБРАЖЕНИЯ ---

  // Показываем лоадер, пока TWA не готов ИЛИ (если TWA готов, но) нет userId
  if (!isTwaReady || !userId) {
    return <LoadingScreen />;
  }

  // Показываем лоадер, пока грузятся данные с нашего бэкенда
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message="Не удалось загрузить данные пользователя." />;
  }

  if (user && user.isBannedInBot) {
    return <BannedScreen />;
  }

  return <>{children}</>;
};

// hooks/useTelegramWebApp.ts
import { useEffect, useState } from "react";
import { TelegramWebApp, TelegramUser } from "../types/telegram";

type Platform = "web" | "mobile" | "desktop" | "unknown";

interface UseTelegramWebAppReturn {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  userId: number | null;
  platform: Platform;
  isWebVersion: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useTelegramWebApp = (): UseTelegramWebAppReturn => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Определяем платформу
    const detectPlatform = (): Platform => {
      if (window.location.hostname.includes("web.telegram.org")) return "web";
      if (
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return "mobile";
      }
      return "desktop";
    };

    setPlatform(detectPlatform());

    const initTelegram = (): boolean => {
      try {
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          setWebApp(tg);

          // Инициализируем приложение
          tg.ready();

          // Пробуем расширить на весь экран
          try {
            tg.expand();
          } catch (e) {
            console.warn("Expand not supported on this platform");
          }

          // Получаем данные пользователя
          if (tg.initDataUnsafe?.user) {
            setUser(tg.initDataUnsafe.user);
          } else {
            setError("Данные пользователя недоступны");
          }

          setIsLoading(false);
          return true;
        }
      } catch (err) {
        setError(
          `Ошибка инициализации: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setIsLoading(false);
      }
      return false;
    };

    // Пробуем инициализировать сразу
    if (!initTelegram()) {
      // Если не получилось, ждем загрузки скрипта
      let attempts = 0;
      const maxAttempts = 100; // 10 секунд

      const checkTelegram = setInterval(() => {
        attempts++;

        if (initTelegram()) {
          clearInterval(checkTelegram);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkTelegram);
          setError("Не удалось загрузить Telegram Web App");
          setIsLoading(false);
        }
      }, 100);

      return () => clearInterval(checkTelegram);
    }
  }, []);

  return {
    webApp,
    user,
    userId: user?.id ?? null,
    platform,
    isWebVersion: platform === "web",
    isLoading,
    error,
  };
};

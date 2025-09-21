// hooks/useTelegramWebApp.ts
"use client";
import { useEffect, useState } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramWebAppData {
  user?: TelegramUser;
  chat_type?: string;
  chat_instance?: string;
  auth_date: number;
  hash: string;
}

interface UseTelegramReturn {
  user: TelegramUser | null;
  userId: number | null;
  webApp: any;
  initData: TelegramWebAppData | null;
  isLoading: boolean;
  error: string | null;
  isInTelegram: boolean;
}

export const useTelegramWebApp = (): UseTelegramReturn => {
  const [state, setState] = useState<UseTelegramReturn>({
    user: null,
    userId: null,
    webApp: null,
    initData: null,
    isLoading: true,
    error: null,
    isInTelegram: false,
  });

  useEffect(() => {
    const initTelegram = () => {
      try {
        if (typeof window === "undefined") {
          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        // Проверяем наличие Telegram WebApp
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;

          // Инициализируем WebApp
          tg.ready();
          tg.expand();

          const initDataUnsafe = tg.initDataUnsafe;
          const user = initDataUnsafe?.user;

          setState({
            user: user || null,
            userId: user?.id || null,
            webApp: tg,
            initData: initDataUnsafe || null,
            isLoading: false,
            error: user ? null : "Данные пользователя недоступны",
            isInTelegram: true,
          });

          console.log("Telegram WebApp initialized:", {
            user,
            initData: tg.initData,
            initDataUnsafe: tg.initDataUnsafe,
            version: tg.version,
          });
        } else {
          // Пробуем альтернативные способы
          const urlParams = new URLSearchParams(window.location.search);
          const userParam = urlParams.get("user");

          if (userParam) {
            try {
              const user = JSON.parse(decodeURIComponent(userParam));
              setState({
                user,
                userId: user.id,
                webApp: null,
                initData: { user, auth_date: Date.now(), hash: "" },
                isLoading: false,
                error: null,
                isInTelegram: true,
              });
              return;
            } catch (e) {
              console.warn("Failed to parse user from URL:", e);
            }
          }

          // Определяем, находимся ли мы в Telegram окружении
          const isTelegramEnv = !!(
            navigator.userAgent.includes("Telegram") ||
            window.location.hostname.includes("telegram") ||
            document.referrer.includes("telegram")
          );

          setState({
            user: null,
            userId: null,
            webApp: null,
            initData: null,
            isLoading: false,
            error: isTelegramEnv
              ? "Telegram WebApp не инициализирован"
              : "Приложение запущено вне Telegram",
            isInTelegram: isTelegramEnv,
          });
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: `Ошибка инициализации: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        }));
      }
    };

    // Проверяем, загружен ли уже скрипт
    if (document.getElementById("telegram-web-app-js")) {
      setTimeout(initTelegram, 100);
    } else {
      // Загружаем скрипт Telegram WebApp
      const script = document.createElement("script");
      script.id = "telegram-web-app-js";
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;

      script.onload = () => {
        setTimeout(initTelegram, 100);
      };

      script.onerror = () => {
        initTelegram(); // Пробуем без скрипта
      };

      document.head.appendChild(script);
    }
  }, []);

  return state;
};

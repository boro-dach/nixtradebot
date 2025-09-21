"use client";
import React, { useEffect, ReactNode } from "react";
import { useTelegramStore } from "@/entities/telegram";

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({
  children,
}) => {
  const {
    setUser,
    setWebApp,
    setInitData,
    setLoading,
    setError,
    setIsInTelegram,
    setInitialized,
    isInitialized,
  } = useTelegramStore();

  useEffect(() => {
    if (isInitialized) return;

    const initTelegram = () => {
      try {
        if (typeof window === "undefined") {
          setLoading(false);
          setInitialized(true);
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

          // Обновляем store
          setWebApp(tg);
          setInitData(initDataUnsafe || null);
          setUser(user || null);
          setIsInTelegram(true);
          setError(user ? null : "Данные пользователя недоступны");

          console.log("Telegram WebApp initialized:", {
            user,
            initData: tg.initData,
            version: tg.version,
          });
        } else {
          // Пробуем альтернативные способы
          const urlParams = new URLSearchParams(window.location.search);
          const userParam = urlParams.get("user");

          if (userParam) {
            try {
              const user = JSON.parse(decodeURIComponent(userParam));
              setUser(user);
              setInitData({ user, auth_date: Date.now(), hash: "" });
              setIsInTelegram(true);
              setError(null);
              setLoading(false);
              setInitialized(true);
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

          setIsInTelegram(isTelegramEnv);
          setError(
            isTelegramEnv
              ? "Telegram WebApp не инициализирован"
              : "Приложение запущено вне Telegram"
          );
        }
      } catch (error) {
        setError(
          `Ошибка инициализации: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
        setInitialized(true);
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
  }, [
    isInitialized,
    setUser,
    setWebApp,
    setInitData,
    setLoading,
    setError,
    setIsInTelegram,
    setInitialized,
  ]);

  return <>{children}</>;
};

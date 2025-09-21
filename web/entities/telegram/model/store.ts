import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  TelegramState,
  TelegramUser,
  TelegramWebAppInstance,
  TelegramInitData,
} from "./types";

const initialState = {
  user: null,
  userId: null,
  webApp: null,
  initData: null,
  isLoading: true,
  isInTelegram: false,
  isInitialized: false,
  error: null,
};

export const useTelegramStore = create<TelegramState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Сеттеры
      setUser: (user: TelegramUser | null) =>
        set(
          (state) => ({
            ...state,
            user,
            userId: user?.id || null,
          }),
          false,
          "setUser"
        ),

      setWebApp: (webApp: TelegramWebAppInstance | null) =>
        set(
          (state) => ({
            ...state,
            webApp,
          }),
          false,
          "setWebApp"
        ),

      setInitData: (initData: TelegramInitData | null) =>
        set(
          (state) => ({
            ...state,
            initData,
          }),
          false,
          "setInitData"
        ),

      setLoading: (isLoading: boolean) =>
        set(
          (state) => ({
            ...state,
            isLoading,
          }),
          false,
          "setLoading"
        ),

      setError: (error: string | null) =>
        set(
          (state) => ({
            ...state,
            error,
          }),
          false,
          "setError"
        ),

      setIsInTelegram: (isInTelegram: boolean) =>
        set(
          (state) => ({
            ...state,
            isInTelegram,
          }),
          false,
          "setIsInTelegram"
        ),

      setInitialized: (isInitialized: boolean) =>
        set(
          (state) => ({
            ...state,
            isInitialized,
          }),
          false,
          "setInitialized"
        ),

      reset: () => set(() => initialState, false, "reset"),

      // Вычисляемые значения
      isAuthenticated: () => {
        const { user, isInTelegram } = get();
        return !!(user && isInTelegram);
      },

      getUserDisplayName: () => {
        const { user } = get();
        if (!user) return "Неизвестный пользователь";

        const { first_name, last_name, username } = user;
        if (first_name && last_name) return `${first_name} ${last_name}`;
        if (first_name) return first_name;
        if (username) return `@${username}`;
        return `User ${user.id}`;
      },
    }),
    {
      name: "telegram-store",
    }
  )
);

// Селекторы для удобства
export const telegramSelectors = {
  user: (state: TelegramState) => state.user,
  userId: (state: TelegramState) => state.userId,
  isAuthenticated: (state: TelegramState) => state.isAuthenticated(),
  isLoading: (state: TelegramState) => state.isLoading,
  error: (state: TelegramState) => state.error,
  webApp: (state: TelegramState) => state.webApp,
  displayName: (state: TelegramState) => state.getUserDisplayName(),
};

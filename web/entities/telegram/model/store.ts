import { create } from "zustand";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface WebApp {
  initDataUnsafe: {
    user?: TelegramUser;
  };
  expand: () => void;
}

interface TelegramState {
  webApp: WebApp | null;
  user: TelegramUser | null;
  init: (webAppInstance: WebApp | undefined) => void;
  expand: () => void;
}

export const useTelegramStore = create<TelegramState>((set, get) => ({
  webApp: null,
  user: null,

  init: (webAppInstance) => {
    if (webAppInstance && webAppInstance.initDataUnsafe?.user) {
      set({ webApp: webAppInstance, user: webAppInstance.initDataUnsafe.user });
    }
  },

  expand: () => {
    const { webApp } = get();
    webApp?.expand();
  },
}));

export const telegramSelectors = {
  userId: (state: TelegramState) => state.user?.id,
  displayName: (state: TelegramState) => {
    if (!state.user) return "User";
    return (
      state.user.first_name +
      (state.user.last_name ? ` ${state.user.last_name}` : "")
    );
  },
  username: (state: TelegramState) => state.user?.username,
  user: (state: TelegramState) => state.user,
};

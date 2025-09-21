export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export interface TelegramChat {
  id: number;
  type: "group" | "supergroup" | "channel";
  title: string;
  username?: string;
  photo_url?: string;
}

export interface TelegramInitData {
  query_id?: string;
  user?: TelegramUser;
  receiver?: TelegramUser;
  chat?: TelegramChat;
  chat_type?: string;
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date: number;
  hash: string;
}

export interface TelegramWebAppInstance {
  initData: string;
  initDataUnsafe: TelegramInitData;
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;

  ready(): void;
  expand(): void;
  close(): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
  sendData(data: string): void;
}

export interface TelegramState {
  // Данные
  user: TelegramUser | null;
  userId: number | null;
  webApp: TelegramWebAppInstance | null;
  initData: TelegramInitData | null;

  // Состояние
  isLoading: boolean;
  isInTelegram: boolean;
  isInitialized: boolean;
  error: string | null;

  // Методы
  setUser: (user: TelegramUser | null) => void;
  setWebApp: (webApp: TelegramWebAppInstance | null) => void;
  setInitData: (data: TelegramInitData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsInTelegram: (inTelegram: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;

  // Вычисляемые значения
  isAuthenticated: () => boolean;
  getUserDisplayName: () => string;
}

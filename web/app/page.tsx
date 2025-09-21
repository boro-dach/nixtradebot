// src/app/page.tsx
"use client";
import { useTelegramStore, telegramSelectors } from "@/entities/telegram";
import Balance from "@/widgets/balance/ui/balance";
import Deposit from "@/features/deposit/ui/deposit";
import Help from "@/features/help/ui/help";
import Trade from "@/features/trade/ui/trade";
import Withdraw from "@/features/withdraw/ui/withdraw";
import ActivesList from "@/widgets/actives-list/ui/actives-list";

const Home = () => {
  const user = useTelegramStore(telegramSelectors.user);
  const userId = useTelegramStore(telegramSelectors.userId);
  const isLoading = useTelegramStore(telegramSelectors.isLoading);
  const error = useTelegramStore(telegramSelectors.error);
  const isAuthenticated = useTelegramStore(telegramSelectors.isAuthenticated);
  const displayName = useTelegramStore(telegramSelectors.displayName);
  const webApp = useTelegramStore(telegramSelectors.webApp);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p>Инициализация Telegram WebApp...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 px-4 max-h-screen">
      {/* Статус пользователя */}
      <div
        className={`w-full p-3 rounded ${
          isAuthenticated
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {isAuthenticated ? (
          <div>
            <p className="font-semibold">✅ Подключен к Telegram</p>
            <p>Пользователь: {displayName}</p>
            <p className="text-sm">ID: {userId}</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold">⚠️ Ограниченный режим</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Отладочная информация */}
      <details className="w-full max-w-md">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
          Debug Info
        </summary>
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs space-y-1">
          <p>
            <strong>userId:</strong> {userId || "null"}
          </p>
          <p>
            <strong>user:</strong> {user ? "есть" : "нет"}
          </p>
          <p>
            <strong>webApp:</strong> {webApp ? "есть" : "нет"}
          </p>
          <p>
            <strong>isAuthenticated:</strong> {String(isAuthenticated)}
          </p>
          <p>
            <strong>displayName:</strong> {displayName}
          </p>
        </div>
      </details>

      <Balance />

      <div className="grid grid-cols-4 grid-rows-1 gap-2 w-full mt-4">
        <Deposit />
        <Withdraw />
        <Trade />
        <Help />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <p className="text-lg font-semibold">Ваши активы:</p>
        <ActivesList />
      </div>
    </div>
  );
};

export default Home;

// Использование в компоненте
"use client";
import Deposit from "@/features/deposit/ui/deposit";
import Help from "@/features/help/ui/help";
import Trade from "@/features/trade/ui/trade";
import Withdraw from "@/features/withdraw/ui/withdraw";
import { useTelegramWebApp } from "@/shared/hooks/useTelegramWebApp";
import ActivesList from "@/widgets/actives-list/ui/actives-list";
import Balance from "@/widgets/balance/ui/balance";

const Home = () => {
  const { user, userId, isLoading, error, isInTelegram } = useTelegramWebApp();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Инициализация Telegram WebApp...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 px-4 max-h-screen">
      {/* Статус */}
      <div
        className={`w-full p-3 rounded ${
          user
            ? "bg-green-100 text-green-800"
            : isInTelegram
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {user ? (
          <div>
            <p className="font-semibold">✅ Подключен к Telegram</p>
            <p>
              Пользователь: {user.first_name} (ID: {userId})
            </p>
          </div>
        ) : (
          <div>
            <p className="font-semibold">
              {isInTelegram ? "⚠️ Ограниченный режим" : "❌ Вне Telegram"}
            </p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

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

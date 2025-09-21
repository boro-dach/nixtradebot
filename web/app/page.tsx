"use client";
import TelegramUserInfo from "@/entities/TelegramUserInfo";
import Deposit from "@/features/deposit/ui/deposit";
import Help from "@/features/help/ui/help";
import Trade from "@/features/trade/ui/trade";
import Withdraw from "@/features/withdraw/ui/withdraw";
import ActivesList from "@/widgets/actives-list/ui/actives-list";
import Balance from "@/widgets/balance/ui/balance";
import React, { useEffect, useState } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

const Home = () => {
  const [launchParams, setLaunchParams] = useState<{
    initDataRaw?: string;
    initData?: any;
    error?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const params = retrieveLaunchParams();
      setLaunchParams({
        initData: params.initData,
      });
    } catch (error) {
      console.warn("Не удалось получить параметры Telegram:", error);
      setLaunchParams({
        error: "Приложение запущено вне Telegram",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Загрузка...</p>
      </div>
    );
  }

  // Показываем предупреждение, если запущено не в Telegram
  if (launchParams.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">⚠️ Предупреждение</p>
          <p>Это приложение предназначено для работы в Telegram.</p>
          <p>Некоторые функции могут быть недоступны.</p>
        </div>

        {/* Показываем приложение с mock данными */}
        <div className="w-full max-w-md">
          <MockApp />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 px-4 max-h-screen">
      <p>{String(launchParams.initData)}</p>
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

// Компонент-заглушка для демонстрации вне Telegram
const MockApp = () => (
  <div className="flex flex-col items-center gap-4 px-4">
    <div className="bg-gray-100 p-4 rounded">
      <p className="text-sm text-gray-600">Demo режим</p>
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

export default Home;

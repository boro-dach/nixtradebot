"use client";

import React, { useEffect, useState } from "react";
import User from "@/entities/user/ui/user";
import { ITransaction } from "@/entities/transaction/model/types";
import { getAllTransactions } from "@/entities/transaction/api/get-all";
import Transaction from "@/entities/transaction/ui/transaction";

const TransactionsList: React.FC = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedTransactions = await getAllTransactions();
        setTransactions(fetchedTransactions);
      } catch (e) {
        setError("Не удалось загрузить тракзакции.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return <p>Загрузка транзаций...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {transactions.map((transactions) => (
        <Transaction key={transactions.user_id} transaction={transactions} />
      ))}
    </div>
  );
};

export default TransactionsList;

import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import { ITransaction, TransactionStatus } from "../model/types";
import { Button } from "@/shared/ui/button";
import { Check, X } from "lucide-react";
import { acceptTransaction } from "../api/accept";
import { rejectTransaction } from "../api/reject";

interface TransactionProps {
  transaction: ITransaction;
}

const Transaction: React.FC<TransactionProps> = ({ transaction }) => {
  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="flex items-center gap-4 w-full">
        <p className="text-xl">
          {transaction.type === "DEPOSIT"
            ? "Пополнение"
            : transaction.type === "WITHDRAW"
            ? "Вывод"
            : ""}{" "}
        </p>
      </CardHeader>
      <CardContent>
        <p>ID пользователя: {transaction.user_id}</p>{" "}
        <p>
          {" "}
          На сумму {String(transaction.amount)}
          {transaction.currency}
        </p>{" "}
        <p>
          Статус:{" "}
          {transaction.status === TransactionStatus.PROCESSING
            ? "В обработке"
            : transaction.status === TransactionStatus.CONFIRMED
            ? "Подтвержен"
            : transaction.status === TransactionStatus.REJECTED
            ? "Отказан"
            : ""}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              acceptTransaction(transaction.id);
            }}
            className="w-8 h-8 cursor-pointer"
          >
            <Check />
          </Button>
          <Button
            onClick={() => {
              rejectTransaction(transaction.id);
            }}
            className="w-8 h-8 cursor-pointer"
          >
            <X />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Transaction;

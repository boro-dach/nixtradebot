import TransactionsList from "@/widgets/transactions/ui/list";
import React from "react";

const Transactions = () => {
  return (
    <div className="flex flex-col p-4 w-full">
      <TransactionsList />
    </div>
  );
};

export default Transactions;

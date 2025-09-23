export enum TransactionStatus {
  PROCESSING = "PROCESSING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
}

export interface ITransaction {
  id: string;
  amount: number;
  user_id: string;
  currency: string;
  type: "DEPOSIT" | "WITHDRAW";
  status: TransactionStatus;
}

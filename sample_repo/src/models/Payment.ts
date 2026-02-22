export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  method: "credit_card" | "paypal" | "bank_transfer" | "cryptocurrency";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessPaymentRequest {
  orderId: number;
  amount: number;
  method: string;
  cardToken?: string;
}

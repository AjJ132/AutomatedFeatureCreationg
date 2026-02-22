import { Payment, ProcessPaymentRequest } from "../models/Payment";

export class PaymentService {
  private payments: Payment[] = [];

  async findAll(): Promise<Payment[]> {
    return this.payments;
  }

  async findById(id: number): Promise<Payment | undefined> {
    return this.payments.find((p) => p.id === id);
  }

  async findByOrderId(orderId: number): Promise<Payment | undefined> {
    return this.payments.find((p) => p.orderId === orderId);
  }

  async processPayment(data: ProcessPaymentRequest): Promise<Payment> {
    const transactionId = this.generateTransactionId();

    const newPayment: Payment = {
      id: Math.max(...this.payments.map((p) => p.id), 0) + 1,
      ...data,
      transactionId,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      method: (data.method as Payment["method"]) || "credit_card",
    };

    this.payments.push(newPayment);

    // Simulate payment processing
    setTimeout(() => {
      const payment = this.payments.find((p) => p.id === newPayment.id);
      if (payment) {
        payment.status = "completed";
        payment.updatedAt = new Date();
      }
    }, 1000);

    return newPayment;
  }

  async refund(paymentId: number): Promise<Payment | undefined> {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) return undefined;

    payment.status = "refunded";
    payment.updatedAt = new Date();
    return payment;
  }

  async getPaymentsByStatus(status: Payment["status"]): Promise<Payment[]> {
    return this.payments.filter((p) => p.status === status);
  }

  async getTotalRevenue(): Promise<number> {
    return this.payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
  }

  private generateTransactionId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}

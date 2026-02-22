import { Order, CreateOrderRequest, OrderItem } from "../models/Order";

export class OrderService {
  private orders: Order[] = [
    {
      id: 1,
      userId: 1,
      items: [
        { productId: 1, quantity: 1, price: 1299.99 },
        { productId: 2, quantity: 2, price: 29.99 },
      ],
      totalAmount: 1359.97,
      status: "delivered",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
    },
  ];

  async findAll(): Promise<Order[]> {
    return this.orders;
  }

  async findById(id: number): Promise<Order | undefined> {
    return this.orders.find((o) => o.id === id);
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.orders.filter((o) => o.userId === userId);
  }

  async create(data: CreateOrderRequest): Promise<Order> {
    const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder: Order = {
      id: Math.max(...this.orders.map((o) => o.id), 0) + 1,
      ...data,
      totalAmount,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  async updateStatus(id: number, status: Order["status"]): Promise<Order | undefined> {
    const order = this.orders.find((o) => o.id === id);
    if (!order) return undefined;

    order.status = status;
    order.updatedAt = new Date();
    return order;
  }

  async cancel(id: number): Promise<Order | undefined> {
    const order = this.orders.find((o) => o.id === id);
    if (!order || order.status !== "pending") return undefined;

    order.status = "cancelled";
    order.updatedAt = new Date();
    return order;
  }

  async getRecentOrders(days: number = 30): Promise<Order[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.orders.filter((o) => o.createdAt >= cutoffDate);
  }
}

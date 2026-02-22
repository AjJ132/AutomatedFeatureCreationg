export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  userId: number;
  items: OrderItem[];
}

export interface HorseModel {
    breed: string;
}

export interface UnicornModel {
    color: string
}
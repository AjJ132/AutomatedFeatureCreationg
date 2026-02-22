import { Router, Request, Response } from "express";
import { OrderService } from "../services/orderService";

const router = Router();
const orderService = new OrderService();

export async function getOrders(req: Request, res: Response): Promise<void> {
  const { userId, days } = req.query;
  let orders;

  if (userId) {
    orders = await orderService.findByUserId(Number(userId));
  } else if (days) {
    orders = await orderService.getRecentOrders(Number(days));
  } else {
    orders = await orderService.findAll();
  }

  res.json(orders);
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const order = await orderService.findById(Number(id));

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  res.json(order);
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const order = await orderService.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: "Invalid order data" });
  }
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status } = req.body;

  const order = await orderService.updateStatus(Number(id), status);

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  res.json(order);
}

export async function cancelOrder(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const order = await orderService.cancel(Number(id));

  if (!order) {
    res.status(404).json({ message: "Order not found or cannot be cancelled" });
    return;
  }

  res.json(order);
}

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id/status", updateOrderStatus);
router.post("/:id/cancel", cancelOrder);

export default router;

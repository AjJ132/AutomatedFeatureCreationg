import { Router, Request, Response } from "express";
import { PaymentService } from "../services/paymentService";

const router = Router();
const paymentService = new PaymentService();

export async function getPayments(req: Request, res: Response): Promise<void> {
  try {
    const { status } = req.query;
    let payments;

    if (status) {
      payments = await paymentService.getPaymentsByStatus(status as any);
    } else {
      payments = await paymentService.findAll();
    }

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
}

export async function getPaymentById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const payment = await paymentService.findById(Number(id));

    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment" });
  }
}

export async function getPaymentByOrder(req: Request, res: Response): Promise<void> {
  try {
    const { orderId } = req.params;
    const payment = await paymentService.findByOrderId(Number(orderId));

    if (!payment) {
      res.status(404).json({ message: "Payment not found for this order" });
      return;
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment" });
  }
}

export async function processPayment(req: Request, res: Response): Promise<void> {
  try {
    const payment = await paymentService.processPayment(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: "Failed to process payment" });
  }
}

export async function refundPayment(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const payment = await paymentService.refund(Number(id));

    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Failed to process refund" });
  }
}

export async function getRevenue(req: Request, res: Response): Promise<void> {
  try {
    const revenue = await paymentService.getTotalRevenue();
    res.json({ totalRevenue: revenue });
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate revenue" });
  }
}

router.get("/", getPayments);
router.get("/revenue", getRevenue);
router.get("/:id", getPaymentById);
router.get("/order/:orderId", getPaymentByOrder);
router.post("/", processPayment);
router.post("/:id/refund", refundPayment);

export default router;

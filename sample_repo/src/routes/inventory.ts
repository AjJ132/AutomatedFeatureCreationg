import { Router, Request, Response } from "express";
import { InventoryService } from "../services/inventoryService";

const router = Router();
const inventoryService = new InventoryService();

export async function getInventory(req: Request, res: Response): Promise<void> {
  try {
    const inventory = await inventoryService.findAll();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
}

export async function getInventoryByProduct(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.params;
    const item = await inventoryService.findByProductId(Number(productId));

    if (!item) {
      res.status(404).json({ message: "Inventory item not found" });
      return;
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
}

export async function reserveStock(req: Request, res: Response): Promise<void> {
  try {
    const { productId, quantity } = req.body;
    const success = await inventoryService.reserve(productId, quantity);

    if (!success) {
      res.status(400).json({ message: "Insufficient stock" });
      return;
    }

    res.json({ message: "Stock reserved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reserve stock" });
  }
}

export async function releaseReservation(req: Request, res: Response): Promise<void> {
  try {
    const { productId, quantity } = req.body;
    const success = await inventoryService.releaseReservation(productId, quantity);

    if (!success) {
      res.status(400).json({ message: "Failed to release reservation" });
      return;
    }

    res.json({ message: "Reservation released successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to release reservation" });
  }
}

export async function updateInventory(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.params;
    const item = await inventoryService.updateStock(Number(productId), req.body);

    if (!item) {
      res.status(404).json({ message: "Inventory item not found" });
      return;
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to update inventory" });
  }
}

export async function getLowStock(req: Request, res: Response): Promise<void> {
  try {
    const threshold = req.query.threshold ? Number(req.query.threshold) : 10;
    const items = await inventoryService.getLowStockItems(threshold);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch low stock items" });
  }
}

export async function getWarehouses(req: Request, res: Response): Promise<void> {
  try {
    const warehouses = await inventoryService.getWarehouses();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch warehouses" });
  }
}

router.get("/", getInventory);
router.get("/product/:productId", getInventoryByProduct);
router.get("/low-stock", getLowStock);
router.get("/warehouses", getWarehouses);
router.post("/reserve", reserveStock);
router.post("/release-reservation", releaseReservation);
router.patch("/product/:productId", updateInventory);

export default router;

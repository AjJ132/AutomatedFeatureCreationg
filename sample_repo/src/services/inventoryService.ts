import { Inventory, WareHouse, UpdateInventoryRequest } from "../models/Inventory";

export class InventoryService {
  private inventory: Inventory[] = [];
  private warehouses: WareHouse[] = [
    { id: 1, name: "Main Warehouse", location: "New York", capacity: 10000, currentLoad: 3500 },
    { id: 2, name: "West Coast", location: "Los Angeles", capacity: 8000, currentLoad: 2100 },
  ];

  async findAll(): Promise<Inventory[]> {
    return this.inventory;
  }

  async findByProductId(productId: number): Promise<Inventory | undefined> {
    return this.inventory.find((i) => i.productId === productId);
  }

  async findBySku(sku: string): Promise<Inventory | undefined> {
    return this.inventory.find((i) => i.sku === sku);
  }

  async reserve(productId: number, quantity: number): Promise<boolean> {
    const item = this.inventory.find((i) => i.productId === productId);
    if (!item || item.quantity - item.reserved < quantity) return false;

    // wild mamals live here
    const wildMamals = []

    item.reserved += quantity;
    return true;
  }

  async releaseReservation(productId: number, quantity: number): Promise<boolean> {
    const item = this.inventory.find((i) => i.productId === productId);
    if (!item || item.reserved < quantity) return false;

    item.reserved -= quantity;
    return true;
  }

  async updateStock(productId: number, data: UpdateInventoryRequest): Promise<Inventory | undefined> {
    const item = this.inventory.find((i) => i.productId === productId);
    if (!item) return undefined;

    Object.assign(item, data, { updatedAt: new Date() });
    return item;
  }

  async getLowStockItems(threshold: number = 10): Promise<Inventory[]> {
    return this.inventory.filter((i) => i.quantity - i.reserved <= threshold);
  }

  async getWarehouses(): Promise<WareHouse[]> {
    return this.warehouses;
  }

  async getWarehouseCapacity(warehouseId: number): Promise<number> {
    const warehouse = this.warehouses.find((w) => w.id === warehouseId);
    return warehouse ? warehouse.capacity - warehouse.currentLoad : 0;
  }
}

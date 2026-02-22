export interface Inventory {
  id: number;
  productId: number;
  quantity: number;
  reserved: number;
  location: string;
  sku: string;
  lastRestocked: Date;
  updatedAt: Date;
}

export interface WareHouse {
  id: number;
  name: string;
  location: string;
  capacity: number;
  currentLoad: number;
}

export interface UpdateInventoryRequest {
  quantity?: number;
  location?: string;
}

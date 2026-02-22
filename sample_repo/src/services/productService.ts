import { Product, CreateProductRequest } from "../models/Product";

export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: "Laptop",
      description: "High-performance laptop",
      price: 1299.99,
      stock: 15,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Mouse",
      description: "Wireless mouse",
      price: 29.99,
      stock: 100,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: "Keyboard",
      description: "Mechanical keyboard",
      price: 99.99,
      stock: 50,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: number): Promise<Product | undefined> {
    return this.products.find((p) => p.id === id);
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.products.filter((p) => p.categoryId === categoryId);
  }

  async create(data: CreateProductRequest): Promise<Product> {
    const newProduct: Product = {
      id: Math.max(...this.products.map((p) => p.id), 0) + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async update(id: number, data: Partial<CreateProductRequest>): Promise<Product | undefined> {
    const product = this.products.find((p) => p.id === id);
    if (!product) return undefined;

    Object.assign(product, data, { updatedAt: new Date() });
    return product;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  async getInStock(): Promise<Product[]> {
    return this.products.filter((p) => p.stock > 0);
  }
}

import { Request, Response } from "express";
import { ProductService } from "../services/productService";

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { sort, order } = req.query;
      let products = await this.productService.findAll();

      if (sort === "price") {
        products.sort((a, b) => (order === "desc" ? b.price - a.price : a.price - b.price));
      }

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productService.findById(Number(id));

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productService.update(Number(id), req.body);

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.productService.delete(Number(id));

      if (!success) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  }

  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { query, minPrice, maxPrice } = req.query;
      let products = await this.productService.findAll();

      if (query) {
        products = products.filter((p) =>
          p.name.toLowerCase().includes(String(query).toLowerCase())
        );
      }

      if (minPrice) {
        products = products.filter((p) => p.price >= Number(minPrice));
      }

      if (maxPrice) {
        products = products.filter((p) => p.price <= Number(maxPrice));
      }

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  }
}

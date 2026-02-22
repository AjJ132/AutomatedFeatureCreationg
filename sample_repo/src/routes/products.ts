import { Router, Request, Response } from "express";
import { ProductService } from "../services/productService";

const router = Router();
const productService = new ProductService();

export async function getProducts(req: Request, res: Response): Promise<void> {
  const { categoryId } = req.query;
  let products;

  if (categoryId) {
    products = await productService.findByCategory(Number(categoryId));
  } else {
    products = await productService.findAll();
  }

  res.json(products);
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const product = await productService.findById(Number(id));

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.json(product);
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid product data" });
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const product = await productService.update(Number(id), req.body);

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.json(product);
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const success = await productService.delete(Number(id));

  if (!success) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.status(204).send();
}

export async function getInStockProducts(req: Request, res: Response): Promise<void> {
  const products = await productService.getInStock();
  res.json(products);
}

router.get("/", getProducts);
router.get("/in-stock", getInStockProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;

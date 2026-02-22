import { Router, Request, Response } from "express";
import { CategoryService } from "../services/categoryService";

const router = Router();
const categoryService = new CategoryService();

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await categoryService.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
}

export async function getCategoryById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const category = await categoryService.findById(Number(id));

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category" });
  }
}

export async function getCategoryBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const category = await categoryService.findBySlug(slug);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category" });
  }
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Failed to create category" });
  }
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const category = await categoryService.update(Number(id), req.body);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category" });
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = await categoryService.delete(Number(id));

    if (!success) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category" });
  }
}

export async function getSubcategories(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const subcategories = await categoryService.getSubcategories(Number(id));
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subcategories" });
  }
}

router.get("/", getCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);
router.get("/:id/subcategories", getSubcategories);
router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;

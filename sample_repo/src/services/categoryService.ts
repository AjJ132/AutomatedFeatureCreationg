import { Category, CreateCategoryRequest } from "../models/Category";

export class CategoryService {
  private categories: Category[] = [
    {
      id: 1,
      name: "Electronics",
      description: "Electronic devices and gadgets",
      slug: "electronics",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Accessories",
      description: "Computer accessories",
      slug: "accessories",
      parentCategoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findAll(): Promise<Category[]> {
    return this.categories;
  }

  async findById(id: number): Promise<Category | undefined> {
    return this.categories.find((c) => c.id === id);
  }

  async findBySlug(slug: string): Promise<Category | undefined> {
    return this.categories.find((c) => c.slug === slug);
  }

  async create(data: CreateCategoryRequest): Promise<Category> {
    const slug = data.name.toLowerCase().replace(/\s+/g, "-");
    const newCategory: Category = {
      id: Math.max(...this.categories.map((c) => c.id), 0) + 1,
      ...data,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.categories.push(newCategory);
    return newCategory;
  }

  async update(id: number, data: Partial<CreateCategoryRequest>): Promise<Category | undefined> {
    const category = this.categories.find((c) => c.id === id);
    if (!category) return undefined;

    Object.assign(category, data, { updatedAt: new Date() });
    return category;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.categories.splice(index, 1);
    return true;
  }

  async getSubcategories(parentId: number): Promise<Category[]> {
    return this.categories.filter((c) => c.parentCategoryId === parentId);
  }
}

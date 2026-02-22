export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  parentCategoryId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  parentCategoryId?: number;
}

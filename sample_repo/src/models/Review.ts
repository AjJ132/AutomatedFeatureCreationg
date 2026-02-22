export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewRequest {
  productId: number;
  userId: number;
  rating: number;
  title: string;
  content: string;
}

import { Review, CreateReviewRequest } from "../models/Review";

export class ReviewService {
  private reviews: Review[] = [];

  async findAll(): Promise<Review[]> {
    return this.reviews;
  }

  async findById(id: number): Promise<Review | undefined> {
    return this.reviews.find((r) => r.id === id);
  }

  async findByProductId(productId: number): Promise<Review[]> {
    return this.reviews.filter((r) => r.productId === productId);
  }

  async findByUserId(userId: number): Promise<Review[]> {
    return this.reviews.filter((r) => r.userId === userId);
  }

  async create(data: CreateReviewRequest): Promise<Review> {
    const newReview: Review = {
      id: Math.max(...this.reviews.map((r) => r.id), 0) + 1,
      ...data,
      helpful: 0,
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reviews.push(newReview);
    return newReview;
  }

  async markHelpful(id: number): Promise<Review | undefined> {
    const review = this.reviews.find((r) => r.id === id);
    if (!review) return undefined;

    review.helpful += 1;
    review.updatedAt = new Date();
    return review;
  }

  async getAverageRating(productId: number): Promise<number> {
    const productReviews = this.reviews.filter((r) => r.productId === productId);
    if (productReviews.length === 0) return 0;

    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / productReviews.length;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.reviews.findIndex((r) => r.id === id);
    if (index === -1) return false;
    this.reviews.splice(index, 1);
    return true;
  }
}

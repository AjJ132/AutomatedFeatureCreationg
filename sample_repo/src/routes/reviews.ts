import { Router, Request, Response } from "express";
import { ReviewService } from "../services/reviewService";

const router = Router();
const reviewService = new ReviewService();

export async function getReviews(req: Request, res: Response): Promise<void> {
  try {
    const { productId, userId } = req.query;
    let reviews;

    if (productId) {
      reviews = await reviewService.findByProductId(Number(productId));
    } else if (userId) {
      reviews = await reviewService.findByUserId(Number(userId));
    } else {
      reviews = await reviewService.findAll();
    }

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
}

export async function getReviewById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const review = await reviewService.findById(Number(id));

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch review" });
  }
}

export async function createReview(req: Request, res: Response): Promise<void> {
  try {
    const review = await reviewService.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: "Failed to create review" });
  }
}

export async function markHelpful(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const review = await reviewService.markHelpful(Number(id));

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark review as helpful" });
  }
}

export async function getAverageRating(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.params;
    const rating = await reviewService.getAverageRating(Number(productId));
    res.json({ productId, averageRating: rating });
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate rating" });
  }
}

export async function deleteReview(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = await reviewService.delete(Number(id));

    if (!success) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review" });
  }
}

router.get("/", getReviews);
router.get("/:id", getReviewById);
router.get("/product/:productId/rating", getAverageRating);
router.post("/", createReview);
router.post("/:id/helpful", markHelpful);
router.delete("/:id", deleteReview);

export default router;

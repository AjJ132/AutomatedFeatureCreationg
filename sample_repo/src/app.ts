import express, { Express } from "express";
import { loggingMiddleware, requestValidationMiddleware } from "./middleware/logging";
import { authMiddleware } from "./middleware/auth";
import userRoutes from "./routes/users";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import { API_VERSION, API_PORT } from "./constants/config";

export function createApp(): Express {
  const app = express();

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Custom middleware
  app.use(loggingMiddleware);
  app.use(requestValidationMiddleware);

  // API version endpoint
  app.get("/api/version", (req, res) => {
    res.json({ version: API_VERSION });
  });

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
  });

  // Routes
  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", authMiddleware, orderRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
  });

  return app;
}

export function startServer(): void {
  const app = createApp();

  app.listen(API_PORT, () => {
    console.log(`Server running on port ${API_PORT}`);
  });
}

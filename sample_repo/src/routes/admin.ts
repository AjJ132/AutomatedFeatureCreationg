import { Router, Request, Response } from "express";
import { analytics } from "../utils/analytics";
import { logger, LogLevel } from "../utils/logger";

const router = Router();

export async function getStats(req: Request, res: Response): Promise<void> {
  try {
    const snapshot = analytics.getSnapshot();
    res.json(snapshot);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
}

export async function getMetrics(req: Request, res: Response): Promise<void> {
  try {
    const { name, limit } = req.query;

    if (!name) {
      res.status(400).json({ message: "Metric name required" });
      return;
    }

    const metrics = analytics.getMetric(String(name), limit ? Number(limit) : 100);
    res.json({ metric: name, data: metrics });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch metrics" });
  }
}

export async function getLogs(req: Request, res: Response): Promise<void> {
  try {
    const { limit } = req.query;
    const logs = logger.getLogs(limit ? Number(limit) : 100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
}

export async function setLogLevel(req: Request, res: Response): Promise<void> {
  try {
    const { level } = req.body;

    if (!["DEBUG", "INFO", "WARN", "ERROR"].includes(level)) {
      res.status(400).json({ message: "Invalid log level" });
      return;
    }

    logger.setLevel(LogLevel[level as keyof typeof LogLevel]);
    res.json({ message: `Log level set to ${level}` });
  } catch (error) {
    res.status(500).json({ message: "Failed to set log level" });
  }
}

export async function getSystemInfo(req: Request, res: Response): Promise<void> {
  try {
    const info = {
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    };

    res.json(info);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch system info" });
  }
}

router.get("/stats", getStats);
router.get("/metrics", getMetrics);
router.get("/logs", getLogs);
router.get("/system", getSystemInfo);
router.post("/log-level", setLogLevel);

export default router;

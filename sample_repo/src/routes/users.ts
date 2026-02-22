import { Router, Request, Response } from "express";
import { UserService } from "../services/userService";

const router = Router();
const userService = new UserService();

export async function getUsers(req: Request, res: Response): Promise<void> {
  const users = await userService.findAll();
  res.json(users);
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = await userService.findById(Number(id));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const user = await userService.create(req.body);
  res.status(201).json(user);
}

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);

export default router;
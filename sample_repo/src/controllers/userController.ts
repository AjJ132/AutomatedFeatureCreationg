import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(Number(id));

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.findById(req.body.id);

      if (user) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const newUser = await this.userService.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.userService.deleteUser(Number(id));

      if (!success) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  }

  async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query;
      const users = await this.userService.findAll();

      const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(String(query).toLowerCase())
      );

      res.json(filtered);
    } catch (error) {
      res.status(500).json({ message: "Failed to search users" });
    }
  }
}

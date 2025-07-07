// controllers/userController.ts
import { Response, RequestHandler } from "express";
import { AuthRequest } from "../types/AuthRequest";
import User from "../models/User";

export const getCurrentUser: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json(req.user);
};
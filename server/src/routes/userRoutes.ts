// routes/userRoutes.ts
import express from "express";
import { getCurrentUser } from "../controllers/userController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.use(authenticate);
router.get("/me", getCurrentUser);

export default router;
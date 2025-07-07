// routes/noteRoutes.ts
import express from "express";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../controllers/noteController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

// ✅ This is fine
router.use(authenticate);

router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;

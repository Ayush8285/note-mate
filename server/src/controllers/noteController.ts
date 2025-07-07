import { Response, RequestHandler } from "express";
import { AuthRequest } from "../types/AuthRequest";
import Note from "../models/Note";

export const getNotes: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const notes = await Note.find({ user: req.user?._id });
  res.json(notes);
};

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const noteCount = await Note.countDocuments({ user: userId });

    const title = req.body.title?.trim() || `Note ${noteCount + 1}`;
    const content = req.body.content?.trim();

    if (!content) {
      res.status(400).json({ error: "Content is required" });
    }

    const newNote = await Note.create({
      user: userId,
      title,
      content,
    });

    res.status(201).json(newNote);
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateNote: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user?._id },
    req.body,
    { new: true }
  );
  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }
  res.json(note);
};

export const deleteNote: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user?._id,
  });
  if (!result) {
    res.status(404).json({ error: "Note not found" });
    return;
  }
  res.json({ message: "Note deleted successfully" });
};
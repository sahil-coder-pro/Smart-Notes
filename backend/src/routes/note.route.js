import { Router } from "express";
import {protect} from "../middlewares/auth.middleware.js";
import { createNote, getNotes, analyzeNote, deleteNote, updateNote } from "../controllers/note.controller.js";

const router = Router();

router.post('/', protect, createNote);
router.get('/', protect, getNotes);
router.patch('/analyze/:id', protect, analyzeNote);
router.patch('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);

export default router;

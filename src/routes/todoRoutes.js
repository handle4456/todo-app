import { Router } from "express";
import { auth } from "../middleware/authMiddleware.js";

import {
  getTodos,
  createTodoController,
  updateTodoController,
  deleteTodoController,
} from "../controllers/todoController.js";

const router = Router();

// 🔥 모든 Todo API 는 인증 필요
router.get("/", auth, getTodos);
router.post("/", auth, createTodoController);
router.put("/:id", auth, updateTodoController);
router.delete("/:id", auth, deleteTodoController);

export default router;

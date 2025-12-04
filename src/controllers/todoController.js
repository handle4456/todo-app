import { getTodosByUser, createTodo, updateTodo, deleteTodo } from "../models/Todo.js";
import { v4 as uuidv4 } from "uuid";

// 🔥 로그인한 사용자의 Todo 목록 + 마감 지난 Todo 자동 삭제
export const getTodos = async (req, res) => {
  try {
    const userId = req.user.email;
    const now = Date.now();

    const allTodos = await getTodosByUser(userId);
    const aliveTodos = [];

    for (const t of allTodos) {
      let expired = false;

      if (t.dueAt) {
        const ts = Date.parse(t.dueAt);
        if (!Number.isNaN(ts) && ts < now) {
          expired = true;
        }
      }

      if (expired) {
        // 마감 지난 Todo 는 DB에서 삭제
        try {
          await deleteTodo(t.id, userId);
          console.log("⏰ 자동 삭제된 Todo:", t.id, t.title);
        } catch (e) {
          console.error("자동 삭제 중 오류:", e);
        }
      } else {
        aliveTodos.push(t);
      }
    }

    return res.json(aliveTodos);
  } catch (err) {
    console.error("GET TODOS ERROR:", err);
    return res.status(500).json({ message: "Todo 조회 오류" });
  }
};

// 🔥 Todo 생성
export const createTodoController = async (req, res) => {
  try {
    const userId = req.user.email;
    const { title, description, dueAt, remindAt } = req.body;

    if (!title) {
      return res.status(400).json({ message: "제목은 필수입니다." });
    }

    const todo = {
      id: uuidv4(),
      userId,
      title,
      description: description || "",
      dueAt: dueAt || null,
      remindAt: remindAt || null,
      isDone: false,
      isReminded: false,
      createdAt: Date.now(),
    };

    await createTodo(todo);
    return res.json(todo);
  } catch (err) {
    console.error("CREATE TODO ERROR:", err);
    return res.status(500).json({ message: "Todo 생성 오류" });
  }
};

// 🔥 Todo 수정 (지금은 크게 안 써도 되지만 유지)
export const updateTodoController = async (req, res) => {
  try {
    const userId = req.user.email;
    const { id } = req.params;
    const { title, description, dueAt, remindAt, isDone } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (dueAt !== undefined) updates.dueAt = dueAt;
    if (remindAt !== undefined) updates.remindAt = remindAt;
    if (isDone !== undefined) updates.isDone = isDone;

    await updateTodo(id, userId, updates);
    return res.json({ message: "Todo 수정 완료" });
  } catch (err) {
    console.error("UPDATE TODO ERROR:", err);
    return res.status(500).json({ message: "Todo 수정 오류" });
  }
};

// 🔥 Todo 삭제 (= 완료 처리 용도로 사용)
export const deleteTodoController = async (req, res) => {
  try {
    const userId = req.user.email;
    const { id } = req.params;

    await deleteTodo(id, userId);
    return res.json({ message: "Todo 삭제 완료" });
  } catch (err) {
    console.error("DELETE TODO ERROR:", err);
    return res.status(500).json({ message: "Todo 삭제 오류" });
  }
};

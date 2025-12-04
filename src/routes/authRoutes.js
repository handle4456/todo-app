// src/routes/authRoutes.js

import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

// 회원가입
router.post("/signup", register);

// 로그인
router.post("/login", login);

export default router;

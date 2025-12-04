import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 1️⃣ API 라우트가 가장 먼저
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// 2️⃣ 그 다음 정적 파일
app.use(express.static(path.join(__dirname, "../front")));

// 3️⃣ 마지막 catch-all
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


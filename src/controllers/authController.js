// src/controllers/authController.js
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { findUserByEmail, createUser } from "../models/User.js";

import { SNSClient, SubscribeCommand } from "@aws-sdk/client-sns";
const sns = new SNSClient({ region: process.env.AWS_REGION });

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "이메일과 비밀번호를 입력하세요." });
    }

    const exist = await findUserByEmail(email);
    if (exist) {
      return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
    }

    // 기존 로직 유지
    const hashed = await bcrypt.hash(password, 10);
    await createUser(email, hashed);

    // ⭐ SNS 구독 (기능 추가)
    await sns.send(
      new SubscribeCommand({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Protocol: "email",
        Endpoint: email,
        Attributes: {
          FilterPolicy: JSON.stringify({
            userId: [email] // 🔥 이 이메일에게만 본인 알림이 감
          })
        }
      })
    );

    const token = generateToken(email);

    return res.json({
      message: "회원가입 성공",
      token
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "이메일과 비밀번호를 입력하세요." });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "존재하지 않는 이메일입니다." });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "비밀번호가 올바르지 않습니다." });
    }

    const token = generateToken(email);

    return res.json({
      message: "로그인 성공",
      token
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

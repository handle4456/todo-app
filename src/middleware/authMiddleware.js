import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "인증 필요" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 토큰 안에 들어있는 id = 이메일을 userId로 사용
    req.user = { email: decoded.id };

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ message: "토큰 인증 실패" });
  }
};

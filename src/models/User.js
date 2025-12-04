// src/models/User.js

import ddb from "../config/dynamo.js";
import {
  GetCommand,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

const TABLE = process.env.DYNAMO_TABLE_USERS;

// 🔍 이메일로 사용자 찾기
export const findUserByEmail = async (email) => {
  const res = await ddb.send(
    new GetCommand({
      TableName: TABLE,
      Key: { email }   // PK = email
    })
  );
  return res.Item || null;
};

// 📝 사용자 생성 (회원가입)
export const createUser = async (email, password) => {
  await ddb.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        email,
        password,
        createdAt: Date.now()
      }
    })
  );
};

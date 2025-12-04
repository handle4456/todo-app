import ddb from "../config/dynamo.js";
import {
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE = process.env.DYNAMO_TABLE_TODOS;

// 🔥 로그인한 사용자(userId = 이메일)의 Todo만 조회
export const getTodosByUser = async (userId) => {
  const res = await ddb.send(
    new ScanCommand({
      TableName: TABLE,
      FilterExpression: "userId = :u",
      ExpressionAttributeValues: {
        ":u": userId,
      },
    })
  );

  return res.Items || [];
};

// 🔥 Todo 생성
export const createTodo = async (todo) => {
  await ddb.send(
    new PutCommand({
      TableName: TABLE,
      Item: todo,
    })
  );
};

// 🔥 Todo 수정 (제목, 설명, 마감/리마인더 시간 등)
export const updateTodo = async (id, userId, updates) => {
  const updateExpParts = [];
  const attrValues = {};

  for (const key of Object.keys(updates)) {
    updateExpParts.push(`${key} = :${key}`);
    attrValues[`:${key}`] = updates[key];
  }

  if (updateExpParts.length === 0) return;

  await ddb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { id, userId },
      UpdateExpression: "SET " + updateExpParts.join(", "),
      ExpressionAttributeValues: attrValues,
    })
  );
};

// 🔥 Todo 삭제
export const deleteTodo = async (id, userId) => {
  await ddb.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { id, userId },
    })
  );
};

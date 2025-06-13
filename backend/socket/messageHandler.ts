import pool from "../db/mariadb";
import { ResultSetHeader } from "mysql2/promise";
import { Server, Socket } from "socket.io";
import type { MessagePayload, SystemMessageProps } from "../common/types";

const saveSendMessageToDB = async (
  userId: number,
  nickname: string,
  content: string
): Promise<ResultSetHeader | null> => {
  const query =
    "INSERT INTO messages (user_id, nickname, content, created_at) VALUES (?, ?, ?, NOW())";
  const values = [userId, nickname, content];

  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query<ResultSetHeader>(query, values);
    return results;
  } catch (err) {
    console.error("DB 오류 : 메시지 저장 실패", err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
};

export function handleMessage(io: Server, socket: Socket) {
  socket.on("SEND_MESSAGE", async (msg: MessagePayload) => {


    console.log("메시지 수신:", msg);

    try {
      // 추후 확장 시 room 번호와 함께 메세지 저장
      // const DBResult = await saveSendMessageToDB(userId, nickName, msg);

      // if(DBResult && DBResult.affectedRows > 0){
      //     console.log('DB : 메시지 저장 성공');
      // }else{
      //     console.warn('DB : 메시지 저장 실패');
      // }

      socket.broadcast.emit("RECEIVE_MESSAGE", msg); // 다른 클라이언트에게만 전송
    } catch (err) {
      console.error("DB : 메시지 처리 중 오류 발생", err);
    }
  });

  socket.on("REQUEST_SYSTEM_MSG", async (data: SystemMessageProps) => {
    io.emit("RECEIVE_SYSTEM_MSG", data); // 모든 유저에게 시스템 메시지 전송
  });
}

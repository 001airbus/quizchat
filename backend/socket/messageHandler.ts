import pool from '../db/mariadb';
import { ResultSetHeader } from 'mysql2/promise';
import { Server, Socket } from 'socket.io';
import type { MessagePayload } from '../../common/types';

const saveSendMessageToDB = async (userId: number, nickname: string, content: string): Promise<ResultSetHeader | null> => {
    const query = 'INSERT INTO messages (user_id, nickname, content, created_at) VALUES (?, ?, ?, NOW())';
    const values = [userId, nickname, content];

    const connection = await pool.getConnection();
    try{
        const [results] = await connection.query<ResultSetHeader>(query, values);
        console.log('DB : 메시지 저장 성공', results);
        return results;
    }catch(err){
        console.error('DB 오류 : 메시지 저장 실패', err);
        throw err;
    }finally{
        if(connection) connection.release();
    }
};

export function handleMessage(io: Server, socket: Socket) {
    socket.on('SEND_MESSAGE', async (msg: string) => {
        const userId = socket.data.userId;
        const nickName = socket.data.nickName;

        const sendMessage: MessagePayload = {
            userId: userId,
            nickName: nickName,
            content: msg,
            timestamp: new Date().toISOString()
        };

        console.log('메시지 수신:', sendMessage);

        try{
            const DBResult = await saveSendMessageToDB(userId, nickName, msg);
            
            if(DBResult && DBResult.affectedRows > 0){
                console.log('DB : 메시지 저장 성공');
            }else{
                console.warn('DB : 메시지 저장 실패');
            }

            // io.emit('RECEIVE_MESSAGE', sendMessage);
            socket.broadcast.emit('RECEIVE_MESSAGE', sendMessage); // 다른 클라이언트에게만 전송
        }catch(err){
            console.error('DB : 메시지 처리 중 오류 발생', err);
            // socket.emit('SEND_MESSAGE_ERROR', {message: '메시지 전송 중 오류가 발생했습니다.'});
        }
    });
}
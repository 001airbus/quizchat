import { Request, Response } from 'express';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { setupSocketIO } from './socket/socketManager';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
    origin: "http://localhost:5176",
    credentials: true,
}));
app.use(express.json());

// catch 404 and forward to error handler
app.use(function(req : Request, res : Response) {
    res.status(StatusCodes.NOT_FOUND).end();
});

const server = http.createServer(app);
const io = new SocketServer(server, {
    cors : {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"], 
        credentials: true 
    }
});

// socket 설정
setupSocketIO(io);

server.listen(PORT, () => {
    console.log("서버 실행")
});

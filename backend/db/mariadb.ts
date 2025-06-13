import mariadb from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// db 연결 정보
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database: 'quizchat',
  dateStrings : true
});

export default pool;
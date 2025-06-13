import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || undefined,
});

redis.on('connect', () => {
  console.log('Redis 클라이언트 연결 성공!');
});

redis.on('error', (err) => {
  console.error('Redis 클라이언트 연결 에러:', err);
});

const getRedisValue = async (key : string) : Promise<string | null> => {
    try {
        return await redis.get(key);
    } catch (err) {
        console.log('Redis 에러 - 조회 실패', err);
        return null;
    }
};

const setRedisValue = async (key : string, value : string, expireTime? : number) : Promise<void> => {
    try {
      expireTime ? await redis.set(key, value, 'EX', expireTime) : await redis.set(key, value);
    } catch (err) {
        console.log('Redis 에러 - 저장 실패', err);
    }
}

const delRedisValue = async (key: string): Promise<void> => {
  try{
    await redis.del(key);
  }catch(err){
    console.log('Redis 에러 - 삭제 실패', err);
  }
};

export { getRedisValue, setRedisValue, delRedisValue };
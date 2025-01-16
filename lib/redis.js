import { createClient } from 'redis';


const redisClient = createClient({
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

let clientReady = false;

export async function getRedisClient() {
  if (!clientReady) {
    await redisClient.connect();
    clientReady = true;
  }
  return redisClient;
}

export async function disconnectRedis() {
  if (clientReady) {
    await redisClient.disconnect();
    clientReady = false;
  }
}


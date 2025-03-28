import { createClient } from "redis";

export const redisClient = createClient({
    // url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    url: `redis://redis:6379`,
});

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.connect().then(() => console.log("Connected to Redis"));
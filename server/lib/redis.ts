import * as redis from 'redis';
import * as express from 'express';
import { promisify } from 'util';

if (process.env.NODE_ENV === 'production' && !process.env.REDIS_PASSWORD) {
  throw new Error('Expected redis password');
}

export type CustomRedisClient = ReturnType<typeof createRedisClient>;

export interface ReqWithRedis extends express.Request {
  redis: CustomRedisClient;
}

// redis typings dont handle setting expiration on set
type SetAsync = (
  key: string,
  value: string,
  ex?: 'ex',
  ttl?: number,
) => Promise<'OK' | undefined>;

export function createRedisClient() {
  if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
    throw new Error('Expected redis host and port');
  }

  const client: redis.RedisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    password: process.env.REDIS_PASSWORD || undefined,
  });

  if (process.env.NODE_ENV !== 'test') {
    console.log('initialized redis client'); // tslint:disable-line no-console
  }

  return {
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client) as SetAsync,
    quit: () => client.quit(),
  };
}

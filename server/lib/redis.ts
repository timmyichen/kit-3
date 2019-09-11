import * as redis from 'redis';
import { promisify } from 'util';

if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
  throw new Error('Expected redis host and port');
}

if (process.env.NODE_ENV === 'production' && !process.env.REDIS_PASSWORD) {
  throw new Error('Expected redis password');
}

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_PASSWORD || undefined,
});

console.log('initialized redis client'); // tslint:disable-line no-console

export const getAsync = promisify(client.get).bind(client);
export const setAsync = promisify(client.set).bind(client);

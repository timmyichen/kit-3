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

// redis typings dont handle setting expiration on set, or args for del
type SetAsync = (
  key: string,
  value: string,
  ex?: 'ex',
  ttl?: number,
) => Promise<'OK' | undefined>;

type DelAsync = (...keys: string[]) => Promise<'OK' | number>;

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
    delAsync: promisify(client.del).bind(client) as DelAsync,
    quit: () => client.quit(),
  };
}

export const daysInSeconds = (days: number) => days * 60 * 60 * 24;
export const minutesInSeconds = (minutes: number) => minutes * 60;

export const genRedisKey = {
  wasNotifiedOfDeetUpdate: ({
    userId,
    deetId,
  }: {
    userId: number;
    deetId: number;
  }) => `email-notified-userId-${userId}-of-deetId-${deetId}-updated`,
  // wasNotifiedOfBirthday: () => '', TODO later when workers
  wasAskedToVerifyDeet: ({
    userId,
    deetId,
  }: {
    userId: number;
    deetId: number;
  }) => `email-asked-to-verify-deetId-${deetId}-by-userId-${userId}`,
  wasInvitedToKit: ({ email }: { email: string }) => `email-invited-${email}`,
  wasAddedAsFriend: ({
    requestedUserId,
    requestingUserId,
  }: {
    requestedUserId: number;
    requestingUserId: number;
  }) => `email-userId-${requestingUserId}-added-userId ${requestedUserId}`,
  hasRequestedPasswordReset: ({ email }: { email: string }) =>
    `email-${email}-reset-password`,
  passwordResetToken: ({ userId }: { userId: number }) =>
    `password-reset-token-userId-${userId}`,
};

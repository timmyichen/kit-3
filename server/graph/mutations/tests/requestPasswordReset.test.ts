import App from 'server/test/app';
import { createUser } from 'server/test/util';
import { Users } from 'server/models';
import * as emails from 'server/lib/emails';
import * as redis from 'server/lib/redis';

jest.spyOn(emails, 'sendPasswordResetEmail');
jest.spyOn(redis.genRedisKey, 'hasRequestedPasswordReset');

describe('requestPasswordReset', () => {
  const app = new App();

  const query = `
    mutation requestPasswordReset($email: String!) {
      requestPasswordReset(email: $email)
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let otherUser: Users;

  beforeAll(async () => {
    await app.initialize();

    [user, otherUser] = await Promise.all([createUser(), createUser()]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('errors on an invalid email', async () => {
    const res = await gqlRequest({ email: 'notanemail' });

    expect(res.body.errors).toBeTruthy();
  });

  it('correctly handles nonexistent email', async () => {
    const res = await gqlRequest({ email: Math.random() + user.email });

    expect(res.body.errors).toBeFalsy();
    expect(res.body.data.requestPasswordReset).toBe(true);

    expect(redis.genRedisKey.hasRequestedPasswordReset).toHaveBeenCalledTimes(
      0,
    );
    expect(emails.sendPasswordResetEmail).toHaveBeenCalledTimes(0);
  });

  it('correctly handles a recently requested user', async () => {
    const res = await gqlRequest({ email: user.email });

    expect(res.body.errors).toBeFalsy();
    expect(res.body.data.requestPasswordReset).toBe(true);

    expect(redis.genRedisKey.hasRequestedPasswordReset).toHaveBeenCalledTimes(
      1,
    );
    expect(emails.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
  });

  it('correctly sends the email once and saves a token to redis', async () => {
    const res = await gqlRequest({ email: otherUser.email });

    expect(res.body.errors).toBeFalsy();
    expect(res.body.data.requestPasswordReset).toBe(true);

    expect(redis.genRedisKey.hasRequestedPasswordReset).toHaveBeenCalledTimes(
      1,
    );
    expect(emails.sendPasswordResetEmail).toHaveBeenCalledTimes(1);

    const res2 = await gqlRequest({ email: otherUser.email });

    expect(res2.body.errors).toBeFalsy();
    expect(res2.body.data.requestPasswordReset).toBe(true);

    expect(redis.genRedisKey.hasRequestedPasswordReset).toHaveBeenCalledTimes(
      2,
    );
    expect(emails.sendPasswordResetEmail).toHaveBeenCalledTimes(1);

    expect(
      await app.redis.getAsync(
        redis.genRedisKey.passwordResetToken({ userId: otherUser.id }),
      ),
    ).toBeTruthy();
  });
});

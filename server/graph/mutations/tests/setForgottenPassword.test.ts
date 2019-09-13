import App from 'server/test/app';
import { createUser } from 'server/test/util';
import { Users } from 'server/models';
import * as redis from 'server/lib/redis';

jest.spyOn(redis.genRedisKey, 'passwordResetToken');

describe('setForgottenPassword', () => {
  const app = new App();

  const setRedisTokenForUser = async ({
    userId,
    token,
  }: {
    userId: number;
    token: string;
  }) => {
    const key = redis.genRedisKey.passwordResetToken({ userId });
    await app.redis.setAsync(key, token, 'ex', redis.daysInSeconds(1));

    return key;
  };

  const query = `
    mutation setForgottenPassword($token: String!, $newPassword: String!) {
      setForgottenPassword(token: $token, newPassword: $newPassword)
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let otherUser: Users;

  beforeAll(async () => {
    await app.initialize();

    jest.spyOn(app.redis, 'getAsync');
    jest.spyOn(app.redis, 'delAsync');

    [user, otherUser] = await Promise.all([
      createUser({ password: 'somepass' }),
      createUser(),
    ]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('errors on an invalid token', async () => {
    const res = await gqlRequest({ token: '', newPassword: 'password' });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors if the user is not found', async () => {
    const res = await gqlRequest({ token: '', newPassword: 'password' });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors on an short password', async () => {
    const res = await gqlRequest({
      token: `${user.id}:tokenwaow`,
      newPassword: 'pass',
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors on an invalid token', async () => {
    const key = await setRedisTokenForUser({
      userId: user.id,
      token: 'goodtoken',
    });
    const res = await gqlRequest({
      token: `${user.id}:badtoken`,
      newPassword: 'password',
    });

    expect(app.redis.getAsync).toBeCalledWith(key);

    expect(res.body.errors).toBeTruthy();
  });

  it('errors on the same password', async () => {
    await setRedisTokenForUser({
      userId: user.id,
      token: 'goodtoken',
    });
    const res = await gqlRequest({
      token: `${user.id}:goodtoken`,
      newPassword: 'somepass',
    });

    expect(res.body.errors).toBeTruthy();

    expect(app.redis.delAsync).not.toBeCalled();
  });

  it('sets the users password and deletes the secret from redis', async () => {
    const key = await setRedisTokenForUser({
      userId: otherUser.id,
      token: 'poopy',
    });
    const emailKey = redis.genRedisKey.hasRequestedPasswordReset({
      email: otherUser.email,
    });
    const password = otherUser.password;

    const res = await gqlRequest({
      token: `${otherUser.id}:poopy`,
      newPassword: 'password',
    });

    expect(res.body.errors).toBeFalsy();
    expect(res.body.data.setForgottenPassword).toBe(true);

    const updatedUser = (await Users.findByPk(otherUser.id)) as Users;

    expect(updatedUser.password).not.toBe(password);

    expect(app.redis.getAsync).toBeCalledWith(key);
    expect(app.redis.delAsync).toBeCalledWith(key);
    expect(app.redis.delAsync).toBeCalledWith(emailKey);
  });
});

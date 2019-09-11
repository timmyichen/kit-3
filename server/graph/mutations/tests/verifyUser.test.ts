import App from 'server/test/app';
import { createUser } from 'server/test/util';
import { Users } from 'server/models';
import { generateEmailHash } from 'server/lib/verifyEmail';

describe('verifyUser', () => {
  const app = new App();

  const query = `
    mutation verifyUser($hash: String!) {
      verifyUser(hash: $hash) {
        id
        isVerified
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let stranger: Users;
  let userHash: string;
  let strangerHash: string;

  beforeAll(async () => {
    await app.initialize();

    [user, stranger] = await Promise.all([createUser(), createUser()]);

    userHash = generateEmailHash(user.email);
    strangerHash = generateEmailHash(stranger.email);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({ hash: userHash });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors on the wrong hash', async () => {
    app.login(user);
    const res = await gqlRequest({ hash: userHash + '1' });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors on someone elses hash', async () => {
    app.login(user);
    const res = await gqlRequest({ hash: strangerHash });

    expect(res.body.errors).toBeTruthy();
  });

  it('verifies a user', async () => {
    app.login(user);
    const res = await gqlRequest({ hash: userHash });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.verifyUser).toEqual({
      id: user.id,
      isVerified: true,
    });
  });
});

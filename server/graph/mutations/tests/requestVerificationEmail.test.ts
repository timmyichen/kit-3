import App from 'server/test/app';
import { createUser } from 'server/test/util';
import { Users } from 'server/models';
import * as emails from 'server/lib/emails';

jest.spyOn(emails, 'sendVerificationEmail');

describe('requestVerificationEmail', () => {
  const app = new App();

  const query = `
    mutation requestVerificationEmail {
      requestVerificationEmail
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let verifiedUser: Users;

  beforeAll(async () => {
    await app.initialize();

    [user, verifiedUser] = await Promise.all([
      createUser(),
      createUser({ isVerified: true }),
    ]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest();

    expect(res.body.errors).toBeTruthy();
  });

  it('errors if youre already verified', async () => {
    app.login(verifiedUser);
    const res = await gqlRequest();

    expect(res.body.errors).toBeTruthy();
  });

  it('verifies a r', async () => {
    app.login(user);
    const res = await gqlRequest();

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.requestVerificationEmail).toBe(true);

    expect(emails.sendVerificationEmail).toHaveBeenCalled();
  });
});

import App from 'server/test/app';
import { createUser } from 'server/test/util';
import { Users } from 'server/models';
import * as emails from 'server/lib/emails';
import * as faker from 'faker';

jest.spyOn(emails, 'sendInviteEmail');

describe('blockUser', () => {
  const app = new App();

  const query = `
    mutation inviteUserToKit($email: String!) {
      inviteUserToKit(email: $email)
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

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({ email: faker.internet.email() });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors on invalid email', async () => {
    app.login(user);
    const res = await gqlRequest({ email: 'not an email' });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors on existing user', async () => {
    app.login(user);
    const res = await gqlRequest({ email: otherUser.email });

    expect(res.body.errors).toBeTruthy();
  });

  it('sends the invitation email', async () => {
    const email = faker.internet.email();

    app.login(user);

    const res = await gqlRequest({ email });

    expect(res.body.errors).toBeFalsy();
    expect(res.body.data.inviteUserToKit).toBe(true);
    expect(emails.sendInviteEmail).toHaveBeenCalled();
  });

  it('errors on a user recently invited', async () => {
    const email = faker.internet.email();

    app.login(user);

    const res = await gqlRequest({ email });

    expect(res.body.errors).toBeFalsy();

    const res2 = await gqlRequest({ email });

    expect(res2.body.errors).toBeTruthy();
  });
});

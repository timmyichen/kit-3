import App from 'server/test/app';
import { createUser } from 'server/test/util';
import { Users } from 'server/models';

describe('updatePassword', () => {
  const app = new App();

  const query = `
    mutation updatePassword(
      $newPassword: String!
      $passwordVerification: String!
    ) {
      updatePassword(
        newPassword: $newPassword
        passwordVerification: $passwordVerification
      )
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;

  beforeAll(async () => {
    await app.initialize();

    user = await createUser({ password: 'password' });
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({
      newPassword: 'newpassword',
      passwordVerification: 'password',
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors on failed password verification', async () => {
    app.login(user);
    const res = await gqlRequest({
      newPassword: 'newpassword',
      passwordVerification: 'password1',
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors on an empty password', async () => {
    app.login(user);
    const res = await gqlRequest({
      newPassword: '   ',
      passwordVerification: 'password',
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('finds a user based on their username', async () => {
    app.login(user);

    const passwordHash = user.password;

    const res = await gqlRequest({
      newPassword: 'newpassword',
      passwordVerification: 'password',
    });

    expect(res.body.errors).toBeFalsy();

    const updatedUser = await Users.findByPk(user.id);

    expect(passwordHash).not.toBe(updatedUser && updatedUser.password);
  });
});

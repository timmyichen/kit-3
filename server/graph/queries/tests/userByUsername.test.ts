import App from 'server/test/app';
import { createUser } from 'server/test/util';
import { Users } from 'server/models';

describe('userByUsername', () => {
  const app = new App();

  const query = `
    query userByUsername($username: String!) {
      userByUsername(username: $username) {
        id
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;

  beforeAll(async () => {
    await app.initialize();

    [user] = await Promise.all([createUser(), createUser()]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('finds a user based on their username', async () => {
    app.logout();
    const res = await gqlRequest({ username: user.username });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.userByUsername.id).toBe(user.id);
  });
});

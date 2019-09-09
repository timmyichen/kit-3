// import * as request from 'supertest';
import App from 'server/test/app';
import { createUser } from 'server/test/util';
import { Users } from 'server/models';

describe('currentUser', () => {
  const app = new App();

  const query = `
    query currentUser {
      currentUser {
        id
        email
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;

  beforeAll(async () => {
    try {
      await app.initialize();
      user = await createUser();
    } catch (e) {
      throw e;
    }
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('sends null for unauthed users', async () => {
    app.logout();
    const res = await gqlRequest();

    expect(res.body.data.currentUser).toBe(null);
  });

  it('sends the user for authed user', async () => {
    app.login(user);
    const res = await gqlRequest();

    expect(res.body.data.currentUser).toEqual({
      id: user.id,
      email: user.email,
    });
  });
});

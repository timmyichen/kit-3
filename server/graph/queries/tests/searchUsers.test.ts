import App from 'server/test/app';
import { createUser, randomUsername } from 'server/test/util';
import { Users } from 'server/models';

describe('searchUsers', () => {
  const app = new App();

  const query = `
    query searchUsers($searchQuery: String!, $count: Int) {
      searchUsers(searchQuery: $searchQuery, count: $count) {
        id
        username
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;

  beforeAll(async () => {
    try {
      await app.initialize();
      user = await createUser();
      await Promise.all([
        createUser({ username: 'abc' + randomUsername().slice(0, 20) }),
        createUser({ username: 'abc' + randomUsername().slice(0, 20) }),
        createUser({ username: 'xyz' + randomUsername().slice(0, 20) }),
      ]);
    } catch (e) {
      throw e;
    }
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects on unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({ searchQuery: '' });

    expect(res.body.errors).toBeTruthy();
  });

  it('searches for users', async () => {
    app.login(user);
    const res = await gqlRequest({ searchQuery: 'abc' });

    expect(res.body.data.searchUsers).toHaveLength(2);
  });

  it('respects count', async () => {
    app.login(user);
    const res = await gqlRequest({ searchQuery: 'abc', count: 1 });

    expect(res.body.data.searchUsers).toHaveLength(1);
  });
});

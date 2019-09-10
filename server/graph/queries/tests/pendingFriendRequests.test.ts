import App from 'server/test/app';
import { createUser, createFriendship, requestFriend } from 'server/test/util';
import { Users } from 'server/models';

describe('pendingFriendRequests', () => {
  const app = new App();

  const query = `
    query pendingFriendRequests($count: Int) {
      pendingFriendRequests(count: $count) {
        id
        username
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let requester1: Users;
  let requester2: Users;
  let friend: Users;

  beforeAll(async () => {
    await app.initialize();

    [user, requester1, requester2, friend] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
      createUser(),
    ]);

    await Promise.all([
      requestFriend(requester1, user),
      requestFriend(requester2, user),
      createFriendship(friend, user),
    ]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects on unauthed users', async () => {
    app.logout();
    const res = await gqlRequest();

    expect(res.body.errors).toBeTruthy();
  });

  it('finds pending friend requests', async () => {
    app.login(user);
    const res = await gqlRequest();

    expect(res.body.errors).toBeFalsy();

    const { pendingFriendRequests } = res.body.data;

    expect(pendingFriendRequests).toHaveLength(2);

    const pendingIds = [requester1.id, requester2.id].sort();
    const returnedPendingIds = pendingFriendRequests
      .map((p: { id: number }) => p.id)
      .sort();

    expect(pendingIds).toEqual(returnedPendingIds);
  });

  it('respects count', async () => {
    app.login(user);
    const res = await gqlRequest({ count: 1 });

    expect(res.body.errors).toBeFalsy();

    const { pendingFriendRequests } = res.body.data;

    expect(pendingFriendRequests).toHaveLength(1);
  });
});

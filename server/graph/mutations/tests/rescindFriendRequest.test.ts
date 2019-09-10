import App from 'server/test/app';
import { createUser, requestFriend } from 'server/test/util';
import { Users } from 'server/models';

describe('rescindFriendRequest', () => {
  const app = new App();

  const query = `
    mutation rescindFriendRequest($targetUserId: Int!) {
      rescindFriendRequest(targetUserId: $targetUserId) {
        id
        isRequested
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let requestedUser: Users;
  let stranger: Users;

  beforeAll(async () => {
    await app.initialize();

    [user, requestedUser, stranger] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
    ]);

    await requestFriend(user, requestedUser);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({ targetUserId: stranger.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the target user doesnt exist', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: 99999 });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when target user hasnt been requested yet', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: stranger.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('rescinds a friend request', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: requestedUser.id });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.rescindFriendRequest).toEqual({
      id: requestedUser.id,
      isRequested: false,
    });
  });
});

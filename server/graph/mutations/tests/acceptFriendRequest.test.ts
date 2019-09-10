import App from 'server/test/app';
import { createUser, requestFriend } from 'server/test/util';
import { Users, FriendRequests } from 'server/models';

describe('acceptFriendRequest', () => {
  const app = new App();

  const query = `
    mutation acceptFriendRequest($targetUserId: Int!) {
      acceptFriendRequest(targetUserId: $targetUserId) {
        id
        isFriend
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let otherUser: Users;
  let stranger: Users;

  beforeAll(async () => {
    await app.initialize();

    [user, otherUser, stranger] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
    ]);
    await requestFriend(otherUser, user);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({ targetUserId: user.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors with no existing request', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: stranger.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors with no existing user', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: 99999 });

    expect(res.body.errors).toBeTruthy();
  });

  it('accepts a request', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: otherUser.id });

    expect(res.body.errors).toBeFalsy();
    expect(res.body.data.acceptFriendRequest).toEqual({
      id: otherUser.id,
      isFriend: true,
    });

    const existingRequest = await FriendRequests.findOne({
      where: {
        target_user: user.id,
        requested_by: otherUser.id,
      },
    });

    expect(existingRequest).toBeFalsy();
  });
});

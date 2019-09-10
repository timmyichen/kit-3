import App from 'server/test/app';
import { createUser, createFriendship } from 'server/test/util';
import { Users } from 'server/models';

describe('removeFriend', () => {
  const app = new App();

  const query = `
    mutation removeFriend($targetUserId: Int!) {
      removeFriend(targetUserId: $targetUserId) {
        id
        isFriend
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let friend: Users;
  let stranger: Users;

  beforeAll(async () => {
    await app.initialize();

    [user, friend, stranger] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
    ]);

    await createFriendship(user, friend);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({ targetUserId: friend.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the target user doesnt exist', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: 99999 });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the target user isnt a friend', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: stranger.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('finds a user based on their username', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: friend.id });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.removeFriend).toEqual({
      id: friend.id,
      isFriend: false,
    });
  });
});

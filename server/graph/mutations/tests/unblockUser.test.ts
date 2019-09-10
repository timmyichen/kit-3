import App from 'server/test/app';
import { createUser, blockUser } from 'server/test/util';
import { Users } from 'server/models';

describe('unblockUser', () => {
  const app = new App();

  const query = `
    mutation unblockUser($targetUserId: Int!) {
      unblockUser(targetUserId: $targetUserId) {
        id
        isBlocked
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let blockedUser: Users;
  let stranger: Users;

  beforeAll(async () => {
    await app.initialize();

    [user, blockedUser, stranger] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
    ]);

    await blockUser(user, blockedUser);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({ targetUserId: blockedUser.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the target user doesnt exist', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: 99999 });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the target user isnt blocked', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: stranger.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('unblocks a user', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: blockedUser.id });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.unblockUser).toEqual({
      id: blockedUser.id,
      isBlocked: false,
    });
  });
});

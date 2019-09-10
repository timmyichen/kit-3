import App from 'server/test/app';
import {
  createUser,
  createFriendship,
  requestFriend,
  blockUser,
} from 'server/test/util';
import { Users } from 'server/models';

describe('requestFriend', () => {
  const app = new App();

  const query = `
    mutation requestFriend($targetUserId: Int!) {
      requestFriend(targetUserId: $targetUserId) {
        id
        isRequested
        isFriend
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let requestedUser: Users;
  let userRequestedUs: Users;
  let friend: Users;
  let stranger: Users;
  let userBlockedUs: Users;

  beforeAll(async () => {
    await app.initialize();

    [
      user,
      friend,
      stranger,
      requestedUser,
      userRequestedUs,
      userBlockedUs,
    ] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
      createUser(),
      createUser(),
      createUser(),
    ]);

    await Promise.all([
      createFriendship(user, friend),
      requestFriend(user, requestedUser),
      requestFriend(userRequestedUs, user),
      blockUser(userBlockedUs, user),
    ]);
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

  it('errors when the target is already a friend', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: friend.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the target blocked us', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: userBlockedUs.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the target user was already requested', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: requestedUser.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('requests someone to be a friend', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: stranger.id });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.requestFriend).toEqual({
      id: stranger.id,
      isRequested: true,
      isFriend: false,
    });
  });

  it('becomes friends with someone who has requetsed us', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: userRequestedUs.id });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.requestFriend).toEqual({
      id: userRequestedUs.id,
      isRequested: false,
      isFriend: true,
    });
  });
});

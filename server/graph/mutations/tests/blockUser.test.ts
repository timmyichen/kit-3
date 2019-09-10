import App from 'server/test/app';
import {
  createUser,
  createFriendship,
  requestFriend,
  createAddress,
  createPhoneNumber,
} from 'server/test/util';
import {
  Users,
  Deets,
  FriendRequests,
  Friendships,
  SharedDeets,
} from 'server/models';

describe('blockUser', () => {
  const app = new App();

  const query = `
    mutation blockUser($targetUserId: Int!) {
      blockUser(targetUserId: $targetUserId) {
        id
        isFriend
        isRequested
        hasRequestedUser
        isBlocked
      }
    }
  `;

  const expectedResult = {
    isFriend: false,
    isRequested: false,
    hasRequestedUser: false,
    isBlocked: true,
  };

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let friend: Users;
  let requestedUser: Users;
  let userRequestedUs: Users;
  let stranger: Users;
  let address: Deets;
  let friendPhone: Deets;

  beforeAll(async () => {
    await app.initialize();

    [
      user,
      friend,
      requestedUser,
      userRequestedUs,
      stranger,
    ] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
      createUser(),
      createUser(),
    ]);

    [address, friendPhone] = await Promise.all([
      createAddress({ ownerId: user.id, sharedWith: [friend.id] }),
      createPhoneNumber({ ownerId: friend.id, sharedWith: [user.id] }),
      createFriendship(user, friend),
      requestFriend(user, requestedUser),
      requestFriend(userRequestedUs, user),
    ]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({ targetUserId: 1 });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors on nonexistent user', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: 99999 });

    expect(res.body.errors).toBeTruthy();
  });

  it('blocks a stranger', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: stranger.id });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.blockUser).toEqual({
      id: stranger.id,
      ...expectedResult,
    });
  });

  it('blocks a user we friended', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: requestedUser.id });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.blockUser).toEqual({
      id: requestedUser.id,
      ...expectedResult,
    });

    const existingRequest = await FriendRequests.findOne({
      where: {
        target_user: requestedUser.id,
        requested_by: user.id,
      },
    });

    expect(existingRequest).toBeFalsy();
  });

  it('blocks a user who friended us', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: userRequestedUs.id });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.blockUser).toEqual({
      id: userRequestedUs.id,
      ...expectedResult,
    });

    const existingRequest = await FriendRequests.findOne({
      where: {
        target_user: user.id,
        requested_by: userRequestedUs.id,
      },
    });

    expect(existingRequest).toBeFalsy();
  });

  it('blocks a friend', async () => {
    app.login(user);
    const res = await gqlRequest({ targetUserId: friend.id });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.blockUser).toEqual({
      id: friend.id,
      ...expectedResult,
    });

    const [
      friendship,
      deetSharedWithFriend,
      deetSharedWithUs,
    ] = await Promise.all([
      Friendships.findOne({
        where: {
          first_user: user.id,
          second_user: friend.id,
        },
      }),
      SharedDeets.findOne({
        where: {
          deet_id: address.id,
          shared_with: friend.id,
        },
      }),
      SharedDeets.findOne({
        where: {
          deet_id: friendPhone.id,
          shared_with: user.id,
        },
      }),
    ]);

    expect(deetSharedWithUs).toBeFalsy();
    expect(deetSharedWithFriend).toBeFalsy();
    expect(friendship).toBeFalsy();
  });
});

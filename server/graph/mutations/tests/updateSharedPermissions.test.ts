import App from 'server/test/app';
import { createUser, createAddress, createFriendship } from 'server/test/util';
import { Users, Deets } from 'server/models';

describe('updateSharedPermissions', () => {
  const app = new App();

  const query = `
    mutation updateSharedPermissions(
      $deetId: Int!
      $userIdsToAdd: [Int]!
      $userIdsToRemove: [Int]!
    ) {
      updateSharedPermissions(
        deetId: $deetId
        userIdsToAdd: $userIdsToAdd
        userIdsToRemove: $userIdsToRemove
      ) {
        id
        hasAccessToDeet(deetId: $deetId)
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let friendWithAccess: Users;
  let friendWithoutAccess: Users;
  let address: Deets;
  let friendsAddress: Deets;
  let stranger: Users;
  let otherFriendWithAccess: Users;

  beforeAll(async () => {
    await app.initialize();

    [
      user,
      friendWithAccess,
      friendWithoutAccess,
      stranger,
      otherFriendWithAccess,
    ] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
      createUser(),
      createUser(),
    ]);

    [address, friendsAddress] = await Promise.all([
      createAddress({
        ownerId: user.id,
        sharedWith: [friendWithAccess.id, otherFriendWithAccess.id],
      }),
      createAddress({ ownerId: friendWithAccess.id }),
      createFriendship(user, friendWithAccess),
      createFriendship(user, friendWithoutAccess),
      createFriendship(user, otherFriendWithAccess),
    ]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({
      deetId: address.id,
      userIdsToAdd: [friendWithoutAccess.id],
      userIdsToRemove: [friendWithAccess.id],
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when target user includes a non-friend', async () => {
    app.login(user);
    const res = await gqlRequest({
      deetId: address.id,
      userIdsToAdd: [stranger.id],
      userIdsToRemove: [],
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when target includes self', async () => {
    app.login(user);
    const res = await gqlRequest({
      deetId: address.id,
      userIdsToAdd: [user.id],
      userIdsToRemove: [],
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when deet not found', async () => {
    app.login(user);
    const res = await gqlRequest({
      deetId: 99999,
      userIdsToAdd: [friendWithoutAccess.id],
      userIdsToRemove: [friendWithAccess.id],
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when you dont own the deet', async () => {
    app.login(user);
    const res = await gqlRequest({
      deetId: friendsAddress.id,
      userIdsToAdd: [friendWithoutAccess.id],
      userIdsToRemove: [friendWithAccess.id],
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('updates shared permissions for a deet', async () => {
    app.login(user);
    const res = await gqlRequest({
      deetId: address.id,
      userIdsToAdd: [friendWithoutAccess.id],
      userIdsToRemove: [friendWithAccess.id],
    });

    expect(res.body.errors).toBeFalsy();

    const affectedUsers = res.body.data.updateSharedPermissions;

    expect(affectedUsers).toEqual([
      { id: friendWithoutAccess.id, hasAccessToDeet: true },
      { id: friendWithAccess.id, hasAccessToDeet: false },
    ]);
  });
});

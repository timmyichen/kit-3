import App from 'server/test/app';
import {
  createUser,
  createFriendship,
  createAddress,
  createPhoneNumber,
} from 'server/test/util';
import { Users, Deets } from 'server/models';

describe('friend', () => {
  const app = new App();

  const query = `
    query friendByUsername($username: String!) {
      friend(username: $username) {
        id
        sharedDeets {
          ... on EmailAddressDeet {
            id
          }
          ... on AddressDeet {
            id
          }
          ... on PhoneNumberDeet {
            id
          }
        }
        viewableDeets {
          ... on EmailAddressDeet {
            id
          }
          ... on AddressDeet {
            id
          }
          ... on PhoneNumberDeet {
            id
          }
        }
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let friend: Users;
  let stranger: Users;
  let ownerAddress: Deets;
  let friendPhone: Deets;

  beforeAll(async () => {
    await app.initialize();
    [friend, user, stranger] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
    ]);

    [ownerAddress, friendPhone] = await Promise.all([
      createAddress({ ownerId: user.id, sharedWith: [friend.id] }),
      createPhoneNumber({ ownerId: friend.id, sharedWith: [user.id] }),
      createAddress({ ownerId: user.id }),
      createFriendship(user, friend),
    ]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects on unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({ username: 'asdf' });

    expect(res.body.errors).toBeTruthy();
  });

  it('requires a username', async () => {
    app.login(user);
    const res = await gqlRequest({ username: '' });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors if youre not their friend', async () => {
    app.login(user);
    const res = await gqlRequest({ username: stranger.username });

    expect(res.body.errors).toBeTruthy();
  });

  it('finds your friend', async () => {
    app.login(user);
    const res = await gqlRequest({ username: friend.username });

    expect(res.body.errors).toBeFalsy();

    const returnedFriend = res.body.data.friend;

    expect(returnedFriend.id).toBe(friend.id);

    expect(returnedFriend.sharedDeets).toHaveLength(1);
    expect(returnedFriend.sharedDeets[0].id).toBe(friendPhone.id);
    expect(returnedFriend.viewableDeets).toHaveLength(1);
    expect(returnedFriend.viewableDeets[0].id).toBe(ownerAddress.id);
  });
});

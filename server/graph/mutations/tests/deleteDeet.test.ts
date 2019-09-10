import App from 'server/test/app';
import { createUser, createAddress } from 'server/test/util';
import { Users, Deets, SharedDeets } from 'server/models';

describe('deleteDeet', () => {
  const app = new App();

  const query = `
    mutation deleteDeet($deetId: Int!) {
      deleteDeet(deetId: $deetId) {
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
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let otherUser: Users;
  let address: Deets;
  let otherUsersAddress: Deets;

  beforeAll(async () => {
    await app.initialize();

    [user, otherUser] = await Promise.all([createUser(), createUser()]);

    [address, otherUsersAddress] = await Promise.all([
      createAddress({ ownerId: user.id, sharedWith: [otherUser.id] }),
      createAddress({ ownerId: otherUser.id }),
    ]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed user', async () => {
    app.logout();
    const res = await gqlRequest({ deetId: address.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors on nonexistent deet id', async () => {
    app.login(user);
    const res = await gqlRequest({ deetId: 99999 });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors on someone elses deet', async () => {
    app.login(user);
    const res = await gqlRequest({ deetId: otherUsersAddress.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('deletes the deet', async () => {
    app.login(user);
    const res = await gqlRequest({ deetId: address.id });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.deleteDeet.id).toBe(address.id);

    const sharedDeet = await SharedDeets.findOne({
      where: {
        deet_id: address.id,
        shared_with: otherUser.id,
      },
    });

    expect(sharedDeet).toBeFalsy();
  });
});

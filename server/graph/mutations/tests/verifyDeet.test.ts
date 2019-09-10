import App from 'server/test/app';
import { createUser, createAddress } from 'server/test/util';
import { Users, Deets } from 'server/models';

describe('verifyDeet', () => {
  const app = new App();

  const query = `
    mutation verifyDeet($deetId: Int!) {
      verifyDeet(deetId: $deetId) {
        ... on EmailAddressDeet {
          id
          verifiedAt
        }
        ... on AddressDeet {
          id
          verifiedAt
        }
        ... on PhoneNumberDeet {
          id
          verifiedAt
        }
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let stranger: Users;
  let address: Deets;
  let strangerAddress: Deets;

  beforeAll(async () => {
    await app.initialize();

    [user, stranger] = await Promise.all([createUser(), createUser()]);

    [address, strangerAddress] = await Promise.all([
      await createAddress({ ownerId: user.id }),
      await createAddress({ ownerId: stranger.id }),
    ]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({ deetId: address.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the deet doesnt exist', async () => {
    app.login(user);
    const res = await gqlRequest({ deetId: 99999 });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the deet doesnt belong to you', async () => {
    app.login(user);
    const res = await gqlRequest({ deetId: strangerAddress.id });

    expect(res.body.errors).toBeTruthy();
  });

  it('verifies a deet', async () => {
    app.login(user);

    const originalTimestamp = address.verified_at;

    const res = await gqlRequest({ deetId: address.id });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.verifyDeet.verifiedAt).not.toBe(originalTimestamp);
  });
});

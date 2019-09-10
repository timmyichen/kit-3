import App from 'server/test/app';
import { createUser, createAddress } from 'server/test/util';
import { Users, Deets } from 'server/models';
import * as faker from 'faker';
import { omit, pick } from 'lodash';

describe('upsertAddress', () => {
  const app = new App();

  const query = `
    mutation upsertAddress(
      $deetId: Int
      $notes: String!
      $label: String!
      $addressLine1: String!
      $addressLine2: String!
      $city: String!
      $state: String!
      $postalCode: String!
      $countryCode: String!
      $isPrimary: Boolean!
    ) {
      upsertAddress(
        deetId: $deetId
        notes: $notes
        label: $label
        addressLine1: $addressLine1
        addressLine2: $addressLine2
        city: $city
        state: $state
        postalCode: $postalCode
        countryCode: $countryCode
        isPrimary: $isPrimary
      ) {
        id
        notes
        label
        addressLine1
        addressLine2
        city
        state
        postalCode
        country
        type
        isPrimary
      }
    }
  `;

  const generateRandomAddress = () => ({
    label: faker.random.word(),
    notes: '',
    addressLine1: faker.address.streetAddress(),
    addressLine2: faker.address.secondaryAddress(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    postalCode: faker.address.zipCode(),
    countryCode: faker.address.countryCode(),
    isPrimary: false,
  });

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let stranger: Users;
  let address: Deets;
  let strangerAddress: Deets;

  beforeAll(async () => {
    await app.initialize();

    [user, stranger] = await Promise.all([createUser(), createUser()]);

    [address, strangerAddress] = await Promise.all([
      createAddress({ ownerId: user.id }),
      createAddress({ ownerId: stranger.id }),
      createAddress({ ownerId: user.id, isPrimary: true }),
    ]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest(generateRandomAddress());

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the deet doesnt exist', async () => {
    app.login(user);
    const res = await gqlRequest({
      ...generateRandomAddress(),
      deetId: 99999,
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the deet doesnt belong to you', async () => {
    app.login(user);
    const res = await gqlRequest({
      ...generateRandomAddress(),
      deetId: strangerAddress.id,
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('creates a new deet', async () => {
    app.login(user);

    const fields = generateRandomAddress();
    const res = await gqlRequest(fields);

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.upsertAddress).toEqual({
      ...omit(fields, 'countryCode'),
      country: fields.countryCode,
      id: res.body.data.upsertAddress.id,
      type: 'address',
    });
  });

  it('updates an existing deet', async () => {
    app.login(user);

    const fields = generateRandomAddress();
    const res = await gqlRequest({
      ...fields,
      deetId: address.id,
    });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.upsertAddress).toEqual({
      ...omit(fields, 'countryCode'),
      country: fields.countryCode,
      id: address.id,
      type: 'address',
    });
  });

  it('when updating primary, un-primaries other addresses', async () => {
    app.login(user);

    const fields = generateRandomAddress();
    const res = await gqlRequest({
      ...fields,
      deetId: address.id,
      isPrimary: true,
    });

    expect(res.body.errors).toBeFalsy();

    expect(pick(res.body.data.upsertAddress, ['id', 'isPrimary'])).toEqual({
      id: address.id,
      isPrimary: true,
    });

    const allPrimaries = await Deets.findAll({
      where: { is_primary: true, owner_id: user.id, type: 'address' },
    });

    expect(allPrimaries).toHaveLength(1);
    expect(allPrimaries[0].id).toBe(address.id);
  });
});

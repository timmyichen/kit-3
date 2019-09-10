import App from 'server/test/app';
import { createUser, createPhoneNumber } from 'server/test/util';
import { Users, Deets } from 'server/models';
import * as faker from 'faker';
import { pick } from 'lodash';

describe('upsertPhoneNumber', () => {
  const app = new App();

  const query = `
    mutation upsertPhoneNumber(
      $deetId: Int
      $notes: String!
      $label: String!
      $phoneNumber: String!
      $countryCode: String!
      $isPrimary: Boolean!
    ) {
      upsertPhoneNumber(
        deetId: $deetId
        notes: $notes
        label: $label
        phoneNumber: $phoneNumber
        countryCode: $countryCode
        isPrimary: $isPrimary
      ) {
        id
        notes
        label
        phoneNumber
        countryCode
        type
        isPrimary
      }
    }
  `;

  const generateRandomPhoneNumber = () => ({
    label: faker.random.word(),
    notes: '',
    countryCode: '+1',
    phoneNumber: faker.phone.phoneNumber(),
    isPrimary: false,
  });

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let stranger: Users;
  let phone: Deets;
  let strangerPhone: Deets;

  beforeAll(async () => {
    await app.initialize();

    [user, stranger] = await Promise.all([createUser(), createUser()]);

    [phone, strangerPhone] = await Promise.all([
      createPhoneNumber({ ownerId: user.id }),
      createPhoneNumber({ ownerId: stranger.id }),
      createPhoneNumber({ ownerId: user.id, isPrimary: true }),
    ]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest(generateRandomPhoneNumber());

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the deet doesnt exist', async () => {
    app.login(user);
    const res = await gqlRequest({
      ...generateRandomPhoneNumber(),
      deetId: 99999,
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the deet doesnt belong to you', async () => {
    app.login(user);
    const res = await gqlRequest({
      ...generateRandomPhoneNumber(),
      deetId: strangerPhone.id,
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('creates a new deet', async () => {
    app.login(user);

    const fields = generateRandomPhoneNumber();
    const res = await gqlRequest(fields);

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.upsertPhoneNumber).toEqual({
      ...fields,
      id: res.body.data.upsertPhoneNumber.id,
      type: 'phone_number',
    });
  });

  it('updates an existing deet', async () => {
    app.login(user);

    const fields = generateRandomPhoneNumber();
    const res = await gqlRequest({
      ...fields,
      deetId: phone.id,
    });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.upsertPhoneNumber).toEqual({
      ...fields,
      id: phone.id,
      type: 'phone_number',
    });
  });

  it('when updating primary, un-primaries other phone numbers', async () => {
    app.login(user);

    const fields = generateRandomPhoneNumber();
    const res = await gqlRequest({
      ...fields,
      deetId: phone.id,
      isPrimary: true,
    });

    expect(res.body.errors).toBeFalsy();

    expect(pick(res.body.data.upsertPhoneNumber, ['id', 'isPrimary'])).toEqual({
      id: phone.id,
      isPrimary: true,
    });

    const allPrimaries = await Deets.findAll({
      where: { is_primary: true, owner_id: user.id, type: 'phone_number' },
    });

    expect(allPrimaries).toHaveLength(1);
    expect(allPrimaries[0].id).toBe(phone.id);
  });
});

import App from 'server/test/app';
import { createUser, createEmailAddress } from 'server/test/util';
import { Users, Deets } from 'server/models';
import * as faker from 'faker';
import { pick } from 'lodash';

describe('upsertEmailAddress', () => {
  const app = new App();

  const query = `
    mutation upsertEmailAddress(
      $deetId: Int
      $notes: String!
      $label: String!
      $emailAddress: String!
      $isPrimary: Boolean!
    ) {
      upsertEmailAddress(
        deetId: $deetId
        notes: $notes
        label: $label
        emailAddress: $emailAddress
        isPrimary: $isPrimary
      ) {
        id
        notes
        label
        emailAddress
        type
        isPrimary
      }
    }
  `;

  const generateRandomEmail = () => ({
    label: faker.random.word(),
    notes: '',
    emailAddress: faker.internet.email(),
    isPrimary: false,
  });

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let stranger: Users;
  let email: Deets;
  let strangerEmail: Deets;

  beforeAll(async () => {
    await app.initialize();

    [user, stranger] = await Promise.all([createUser(), createUser()]);

    [email, strangerEmail] = await Promise.all([
      createEmailAddress({ ownerId: user.id }),
      createEmailAddress({ ownerId: stranger.id }),
      createEmailAddress({ ownerId: user.id, isPrimary: true }),
    ]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest(generateRandomEmail());

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the deet doesnt exist', async () => {
    app.login(user);
    const res = await gqlRequest({
      ...generateRandomEmail(),
      deetId: 99999,
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors when the deet doesnt belong to you', async () => {
    app.login(user);
    const res = await gqlRequest({
      ...generateRandomEmail(),
      deetId: strangerEmail.id,
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('creates a new deet', async () => {
    app.login(user);

    const fields = generateRandomEmail();
    const res = await gqlRequest(fields);

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.upsertEmailAddress).toEqual({
      ...fields,
      id: res.body.data.upsertEmailAddress.id,
      type: 'email_address',
    });
  });

  it('updates an existing deet', async () => {
    app.login(user);

    const fields = generateRandomEmail();
    const res = await gqlRequest({
      ...fields,
      deetId: email.id,
    });

    expect(res.body.errors).toBeFalsy();

    expect(res.body.data.upsertEmailAddress).toEqual({
      ...fields,
      id: email.id,
      type: 'email_address',
    });
  });

  it('when updating primary, un-primaries other email_addresses', async () => {
    app.login(user);

    const fields = generateRandomEmail();
    const res = await gqlRequest({
      ...fields,
      deetId: email.id,
      isPrimary: true,
    });

    expect(res.body.errors).toBeFalsy();

    expect(pick(res.body.data.upsertEmailAddress, ['id', 'isPrimary'])).toEqual(
      {
        id: email.id,
        isPrimary: true,
      },
    );

    const allPrimaries = await Deets.findAll({
      where: { is_primary: true, owner_id: user.id, type: 'email_address' },
    });

    expect(allPrimaries).toHaveLength(1);
    expect(allPrimaries[0].id).toBe(email.id);
  });
});

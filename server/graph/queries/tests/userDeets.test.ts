import App from 'server/test/app';
import {
  createUser,
  createPhoneNumber,
  createAddress,
  createEmailAddress,
} from 'server/test/util';
import { Users, Deets } from 'server/models';

describe('userDeets', () => {
  const app = new App();

  const query = `
  query currentUserDeets {
    userDeets {
      ... on EmailAddressDeet {
        id
        notes
        label
        type
        isPrimary
      }
      ... on AddressDeet {
        id
        notes
        label
        type
        isPrimary
      }
      ... on PhoneNumberDeet {
        id
        notes
        label
        type
        isPrimary
      }
    }
  }
  `;

  const getFields = (d: Deets) => ({
    id: d.id,
    notes: d.notes,
    label: d.label,
    type: d.type,
    isPrimary: d.is_primary,
  });

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let phoneNumber: Deets;
  let address: Deets;
  let emailAddress: Deets;

  beforeAll(async () => {
    try {
      await app.initialize();
      user = await createUser();

      [address, emailAddress, phoneNumber] = await Promise.all([
        createAddress({ ownerId: user.id }),
        createEmailAddress({ ownerId: user.id }),
        createPhoneNumber({ ownerId: user.id }),
      ]);
    } catch (e) {
      throw e;
    }
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects on unauthed users', async () => {
    app.logout();
    const res = await gqlRequest();

    expect(res.body.errors).toBeTruthy();
  });

  it('finds all deets', async () => {
    app.login(user);
    const res = await gqlRequest();

    expect(res.body.errors).toBeFalsy();

    const all: Array<Deets> = res.body.data.userDeets;

    expect(all).toHaveLength(3);

    const returnedAddress = all.filter(d => d.type === 'address')[0];
    const returnedEmailAddress = all.filter(d => d.type === 'email_address')[0];
    const returnedPhoneNumber = all.filter(d => d.type === 'phone_number')[0];

    expect(returnedAddress).toEqual(getFields(address));
    expect(returnedPhoneNumber).toEqual(getFields(phoneNumber));
    expect(returnedEmailAddress).toEqual(getFields(emailAddress));
  });
});

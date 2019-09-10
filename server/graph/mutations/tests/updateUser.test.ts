import App from 'server/test/app';
import {
  createUser,
  randomFirstAndLastNames,
  randomEmail,
} from 'server/test/util';
import { Users } from 'server/models';

describe('updateUser', () => {
  const app = new App();

  const query = `
  mutation updateUser(
    $email: String!
    $passwordVerification: String!
    $givenName: String!
    $familyName: String!
    $birthday: String
  ) {
    updateUser(
      email: $email
      passwordVerification: $passwordVerification
      givenName: $givenName
      familyName: $familyName
      birthday: $birthday
    ) {
      birthdayDate
      birthdayYear
      email
      givenName
      familyName
    }
  }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  const updates = {
    givenName: randomFirstAndLastNames()[0],
    familyName: randomFirstAndLastNames()[1],
    email: randomEmail(),
  };

  let user: Users;

  beforeAll(async () => {
    await app.initialize();

    user = await createUser({ password: 'password' });
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects unauthed users', async () => {
    app.logout();
    const res = await gqlRequest({
      updates,
      passwordVerification: 'password',
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors with failed password verification', async () => {
    app.login(user);
    const res = await gqlRequest({
      ...updates,
      passwordVerification: 'somethingelse',
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors with an invalid birthday', async () => {
    app.login(user);
    const res = await gqlRequest({
      ...updates,
      passwordVerification: 'password',
      birthday: '1000-31-31',
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('errors with an empty givenName', async () => {
    app.login(user);
    const res = await gqlRequest({
      ...updates,
      passwordVerification: 'password',
      givenName: '    ',
    });

    expect(res.body.errors).toBeTruthy();
  });

  it('updates a user', async () => {
    app.login(user);

    const res = await gqlRequest({
      ...updates,
      passwordVerification: 'password',
      birthday: '1991-08-11',
    });

    expect(res.body.errors).toBeFalsy();

    const updatedFields = res.body.data.updateUser;

    expect(updatedFields).toEqual({
      ...updates,
      birthdayYear: '1991',
      birthdayDate: String(new Date('1234-08-11').getTime()),
    });
  });
});

import App from 'server/test/app';
import {
  createUser,
  createAddress,
  createPhoneNumber,
  createEmailAddress,
  createFriendship,
} from 'server/test/util';
import { Users } from 'server/models';

describe('userTodos', () => {
  const app = new App();

  const query = `
    query userTodos {
      userTodos {
        hasFriends
        hasDeets
        hasPrimaryAddress
        hasPrimaryPhoneNumber
        hasPrimaryEmailAddress
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let userWithAllTodos: Users;
  let userWithNoTodos: Users;
  let otherUser: Users;

  beforeAll(async () => {
    await app.initialize();

    [userWithAllTodos, userWithNoTodos, otherUser] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
    ]);

    await Promise.all([
      createAddress({ ownerId: userWithNoTodos.id, isPrimary: true }),
      createPhoneNumber({ ownerId: userWithNoTodos.id, isPrimary: true }),
      createEmailAddress({ ownerId: userWithNoTodos.id, isPrimary: true }),
      createFriendship(userWithNoTodos, otherUser),
    ]);
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('rejects on unauthed users', async () => {
    app.logout();
    const res = await gqlRequest();

    expect(res.body.errors).toBeTruthy();
  });

  it('checks a user with all todos', async () => {
    app.login(userWithAllTodos);
    const res = await gqlRequest();

    expect(res.body.errors).toBeFalsy();

    const todos = res.body.data.userTodos;

    expect(Object.values(todos)).toEqual(new Array(5).fill(false));
  });

  it('checks a user with no todos', async () => {
    app.login(userWithNoTodos);
    const res = await gqlRequest();

    expect(res.body.errors).toBeFalsy();

    const todos = res.body.data.userTodos;

    expect(Object.values(todos)).toEqual(new Array(5).fill(true));
  });
});

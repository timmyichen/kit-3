import App from 'server/test/app';
import {
  createUser,
  createAddress,
  createEmailAddress,
  createFriendship,
} from 'server/test/util';
import { Users, Deets } from 'server/models';

describe('accessibleDeets', () => {
  const app = new App();

  const query = `
    query accessibleDeets($type: String, $after: String, $count: Int) {
      accessibleDeets(type: $type, count: $count, after: $after) {
        items {
          ... on EmailAddressDeet {
            id
            owner {
              id
            }
          }
          ... on AddressDeet {
            id
            owner {
              id
            }
          }
          ... on PhoneNumberDeet {
            id
            owner {
              id
            }
          }
        }
        pageInfo {
          hasNext
          nextCursor
        }
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let friend1: Users;
  let friend2: Users;
  let address: Deets;
  let email: Deets;

  beforeAll(async () => {
    await app.initialize();

    [user, friend1, friend2] = await Promise.all([
      createUser(),
      createUser(),
      createUser(),
    ]);

    // must be done in serial so they have different time_updated timestamps
    // otherwise leads to flaky tests
    (address = await createAddress({
      ownerId: friend1.id,
      sharedWith: [user.id],
    })),
      (email = await createEmailAddress({
        ownerId: friend2.id,
        sharedWith: [user.id],
      })),
      await Promise.all([
        createFriendship(user, friend1),
        createFriendship(user, friend2),
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

  it('gets all accessible deets', async () => {
    app.login(user);
    const res = await gqlRequest();

    expect(res.body.errors).toBeFalsy();

    const deets = res.body.data.accessibleDeets.items;

    expect(deets).toHaveLength(2);

    const returnedDeetIds = deets.map((d: { id: string }) => d.id).sort();
    const deetIds = [address.id, email.id].sort();

    expect(returnedDeetIds).toEqual(deetIds);
  });

  it('gets accessible deets by type', async () => {
    app.login(user);
    const res = await gqlRequest({ type: 'address' });

    expect(res.body.errors).toBeFalsy();

    const deets = res.body.data.accessibleDeets.items;

    expect(deets).toHaveLength(1);

    expect(deets[0].id).toEqual(address.id);
  });

  it('respects count and paginates', async () => {
    app.login(user);
    const res = await gqlRequest({ count: 1 });

    expect(res.body.errors).toBeFalsy();

    const { items: deets, pageInfo } = res.body.data.accessibleDeets;

    let deetIds = [address.id, email.id];

    expect(pageInfo.hasNext).toBe(true);
    expect(deets).toHaveLength(1);
    expect(deetIds.includes(deets[0].id)).toBe(true);

    deetIds = deetIds.filter(id => id !== deets[0].id);
    expect(deetIds).toHaveLength(1);

    const res2 = await gqlRequest({ count: 1, after: pageInfo.nextCursor });

    const {
      items: deets2,
      pageInfo: pageInfo2,
    } = res2.body.data.accessibleDeets;

    expect(pageInfo2.hasNext).toBe(false);
    expect(deets2).toHaveLength(1);
    expect(deets2[0].id).toBe(deetIds[0]);
  });
});

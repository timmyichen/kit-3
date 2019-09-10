import App from 'server/test/app';
import { createUser, createFriendship, randomUsername } from 'server/test/util';
import { Users } from 'server/models';

describe('friends', () => {
  const app = new App();

  const query = `
    query friends($searchQuery: String, $count: Int, $after: String) {
      friends(searchQuery: $searchQuery, count: $count, after: $after) {
        items {
          id
          username
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
  let friends: Array<Users>;

  beforeAll(async () => {
    await app.initialize();

    user = await createUser();

    // must be done in serial so they have different time_updated timestamps
    // otherwise leads to flaky tests
    friends = [
      await createUser({
        username: 'sdfgsdfsg' + randomUsername().slice(0, 15),
      }),
      await createUser({
        username: 'fghsdfghg' + randomUsername().slice(0, 15),
      }),
    ];

    await Promise.all([
      createFriendship(user, friends[0]),
      createFriendship(user, friends[1]),
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

  it('finds all your friends', async () => {
    app.login(user);
    const res = await gqlRequest();

    expect(res.body.errors).toBeFalsy();

    const returnedFriends = res.body.data.friends.items;

    expect(returnedFriends).toHaveLength(2);

    const returnedFriendIds = returnedFriends.map((f: Users) => f.id);
    const friendIds = friends.map(f => f.id);

    expect(returnedFriendIds.sort()).toEqual(friendIds.sort());
  });

  it('finds all your friends with search', async () => {
    app.login(user);
    const res = await gqlRequest({ searchQuery: 'sdfg' });

    expect(res.body.errors).toBeFalsy();

    const returnedFriends = res.body.data.friends.items;

    expect(returnedFriends).toHaveLength(1);

    expect(returnedFriends[0].id).toBe(friends[0].id);
  });

  it('respects count and paginates', async () => {
    app.login(user);
    const res = await gqlRequest({ count: 1 });

    expect(res.body.errors).toBeFalsy();

    const { items: returnedFriends, pageInfo } = res.body.data.friends;

    let friendIds = friends.map(f => f.id);

    expect(returnedFriends).toHaveLength(1);
    expect(friendIds.includes(returnedFriends[0].id)).toBe(true);

    friendIds = friendIds.filter(id => id !== returnedFriends[0].id);
    expect(friendIds).toHaveLength(1);

    expect(pageInfo.hasNext).toBe(true);

    const res2 = await gqlRequest({ count: 1, after: pageInfo.nextCursor });

    expect(res2.body.errors).toBeFalsy();

    const {
      items: returnedFriends2,
      pageInfo: pageInfo2,
    } = res2.body.data.friends;

    expect(pageInfo2.hasNext).toBe(false);
    expect(returnedFriends2).toHaveLength(1);
    expect(returnedFriends2[0].id).toBe(friendIds[0]);
  });
});

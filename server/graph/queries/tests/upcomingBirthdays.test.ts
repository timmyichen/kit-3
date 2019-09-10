import App from 'server/test/app';
import { createUser, createFriendship } from 'server/test/util';
import { Users } from 'server/models';

describe('upcomingBirthdays', () => {
  const app = new App();

  const query = `
    query upcomingBirthdays($days: Int) {
      upcomingBirthdays(days: $days) {
        id
        birthday
        birthdayYear
      }
    }
  `;

  const gqlRequest = (variables?: Object) => app.graphQL({ query, variables });

  let user: Users;
  let friend1: Users;
  let friend2: Users;

  beforeAll(async () => {
    await app.initialize();

    const closerBirthday = new Date();
    closerBirthday.setDate(closerBirthday.getDate() + 20);
    const furtherBirthday = new Date();
    furtherBirthday.setDate(furtherBirthday.getDate() + 50);

    [user, friend1, friend2] = await Promise.all([
      createUser(),
      createUser({ birthday: closerBirthday }),
      createUser({ birthday: furtherBirthday }),
    ]);

    await Promise.all([
      createFriendship(friend1, user),
      createFriendship(friend2, user),
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

  it('finds upcoming birthdays in a range', async () => {
    app.login(user);
    const res = await gqlRequest({ days: 30 });

    expect(res.body.errors).toBeFalsy();

    const upcomingBirthdays = res.body.data.upcomingBirthdays;

    expect(upcomingBirthdays).toHaveLength(1);
    expect(upcomingBirthdays[0].id).toBe(friend1.id);
  });

  it('finds upcoming birthdays order of date', async () => {
    app.login(user);
    const res = await gqlRequest({ days: 90 });

    expect(res.body.errors).toBeFalsy();

    const upcomingBirthdays = res.body.data.upcomingBirthdays;

    expect(upcomingBirthdays).toHaveLength(2);
    expect(upcomingBirthdays.map((f: { id: number }) => f.id)).toEqual([
      friend1.id,
      friend2.id,
    ]);
  });
});

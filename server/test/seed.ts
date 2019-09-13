import 'module-alias/register';
import * as dotenv from 'dotenv';
import { db } from 'server/lib/db';
import {
  createUser,
  randomInt,
  blockUser,
  requestFriend,
  createFriendship,
  createAddress,
  createPhoneNumber,
  createEmailAddress,
} from './util';
import * as faker from 'faker';
import { execSync } from 'child_process';
import { question } from 'readline-sync';

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  throw new Error('u wot m8');
}

const answer = question(
  'This will clear out any existing dev databases, are you sure you want to do this? [Y|n]: ',
);

if (answer && answer.trim().toLowerCase() === 'n') {
  process.exit(0);
}

try {
  execSync('dropdb -h db -U postgres postgres');
  console.log('Destroyed existing dev database');
} catch (e) {
  console.log('Couldnt delete database, maybe it didnt exist? Error below');
  console.log(e.message);
}

execSync('createdb -h db -U postgres postgres');
console.log('Created new dev database');

console.log('Running migrations...');
execSync('./node_modules/.bin/sequelize db:migrate', { stdio: 'inherit' });
console.log('Migrations completed');

(async () => {
  console.log('starting seed');
  await db.authenticate();
  console.log('...connected to db');

  const you = await createUser({
    username: 'testuser1',
    givenName: 'John',
    familyName: 'Smith',
    password: 'password',
    email: 'test@test.test',
  });

  console.log('...made you (testuser1/password)');

  const blockedYou = await createUser({
    username: 'blockedya',
    password: 'password',
  });

  console.log('...made someone who hates you');

  await blockUser(blockedYou, you);

  const userPromises = [];

  for (let i = 0; i < 100; i++) {
    userPromises.push(
      createUser({
        password: 'password',
        birthday: faker.date.past(randomInt(20, 50)),
      }),
    );
  }

  const users = await Promise.all(userPromises);

  console.log('...made a bunch of users');

  const friendIds: Array<number> = [];
  const deetPromises = [
    createAddress({ ownerId: you.id }),
    createPhoneNumber({ ownerId: you.id }),
    createEmailAddress({ ownerId: you.id }),
  ];
  const relationshipPromises = [];

  for (const user of users.slice(0, 4)) {
    relationshipPromises.push(requestFriend(you, user));
    users.shift();
  }

  for (const user of users.slice(0, 4)) {
    relationshipPromises.push(requestFriend(user, you));
    users.shift();
  }

  for (const user of users) {
    const isFriend = Math.random() < 0.3;

    if (isFriend) {
      friendIds.push(user.id);
      relationshipPromises.push(createFriendship(you, user));
    }

    deetPromises.push(
      createAddress({
        ownerId: user.id,
        sharedWith: isFriend ? [you.id] : [],
        isPrimary: randomInt(1, 2) === 1,
      }),
    );
    deetPromises.push(
      createPhoneNumber({
        ownerId: user.id,
        sharedWith: isFriend ? [you.id] : [],
        isPrimary: randomInt(1, 2) === 1,
      }),
    );
    deetPromises.push(
      createEmailAddress({
        ownerId: user.id,
        sharedWith: isFriend ? [you.id] : [],
        isPrimary: randomInt(1, 2) === 1,
      }),
    );
  }

  await Promise.all<any>([...deetPromises, ...relationshipPromises]);

  console.log('...made some relationships and some deets');

  console.log('completed seeding!');
})();

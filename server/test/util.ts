import * as bluebird from 'bluebird';
import { Users } from 'server/models';
import * as faker from 'faker';
const bcrypt = bluebird.promisifyAll(require('bcrypt-nodejs'));

export const randomName = faker.name.findName;
export const randomEmail = faker.internet.email;

export interface LoginUser {
  username: string;
  password: string;
}

export async function createUser(
  opts: {
    username?: string;
    email?: string;
    givenName?: string;
    familyName?: string;
    password?: string;
    birthday?: Date;
  } = {},
) {
  const salt = await bcrypt.genSaltAsync(10);
  const hash = await bcrypt.hashAsync(
    opts.password || randomName(),
    salt,
    null,
  );

  const birthday = opts.birthday || new Date();

  const birthdayDate = birthday;
  birthdayDate.setFullYear(1234);
  const birthdayYear = birthday.getFullYear();

  return Users.create({
    username: opts.username || randomName(),
    email: opts.email || randomEmail(),
    given_name: opts.givenName || faker.name.firstName(),
    family_name: opts.familyName || faker.name.lastName(),
    password: hash,
    birthday_date: birthdayDate,
    birthday_year: birthdayYear,
  });
}

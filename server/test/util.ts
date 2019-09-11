import * as bluebird from 'bluebird';
import {
  Users,
  Deets,
  Addresses,
  PhoneNumbers,
  EmailAddresses,
  Friendships,
  FriendRequests,
  BlockedUsers,
  SharedDeets,
} from 'server/models';
import * as faker from 'faker';
const bcrypt = bluebird.promisifyAll(require('bcrypt-nodejs'));

export const randomName = faker.name.findName;
export const randomFirstAndLastNames = () => [
  faker.name.firstName(),
  faker.name.lastName(),
];
export const randomEmail = faker.internet.email;
export const randomUsername = () =>
  faker.name
    .findName()
    .replace(/ /gi, '')
    .slice(0, 24);

export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export async function createUser(
  opts: {
    username?: string;
    email?: string;
    givenName?: string;
    familyName?: string;
    password?: string;
    birthday?: Date;
    isVerified?: boolean;
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
    username: opts.username || randomUsername(),
    email: opts.email || randomEmail(),
    given_name: opts.givenName || faker.name.firstName(),
    family_name: opts.familyName || faker.name.lastName(),
    password: hash,
    birthday_date: birthdayDate,
    birthday_year: birthdayYear,
    is_verified: opts.isVerified || false,
  });
}

export async function createAddress(opts: {
  ownerId: number;
  notes?: string;
  label?: string;
  isPrimary?: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  sharedWith?: Array<number>;
}) {
  const deet = await Deets.create({
    owner_id: opts.ownerId,
    notes: opts.notes || '',
    label: opts.label || faker.random.word(),
    is_primary: !!opts.isPrimary,
    type: 'address',
  });

  const address = await Addresses.create({
    deet_id: deet.id,
    address_line_1: opts.addressLine1 || faker.address.streetAddress(),
    address_line_2: opts.addressLine2 || faker.address.secondaryAddress(),
    city: opts.city || faker.address.city(),
    state: opts.state || faker.address.stateAbbr(),
    postal_code: opts.postalCode || faker.address.zipCode(),
    country_code: opts.countryCode || faker.address.countryCode(),
  });

  deet.address = address;

  if (opts.sharedWith) {
    await Promise.all(
      opts.sharedWith.map(userId =>
        SharedDeets.create({
          deet_id: deet.id,
          shared_with: userId,
        }),
      ),
    );
  }

  return deet;
}

export async function createPhoneNumber(opts: {
  ownerId: number;
  notes?: string;
  label?: string;
  isPrimary?: boolean;
  countryCode?: string;
  phoneNumber?: string;
  sharedWith?: Array<number>;
}) {
  const deet = await Deets.create({
    owner_id: opts.ownerId,
    notes: opts.notes || '',
    label: opts.label || faker.random.word(),
    is_primary: !!opts.isPrimary,
    type: 'phone_number',
  });

  const phoneNumber = await PhoneNumbers.create({
    deet_id: deet.id,
    country_code: opts.countryCode || '+1',
    phone_number: opts.phoneNumber || faker.phone.phoneNumber(),
  });

  deet.phone_number = phoneNumber;

  if (opts.sharedWith) {
    await Promise.all(
      opts.sharedWith.map(userId =>
        SharedDeets.create({
          deet_id: deet.id,
          shared_with: userId,
        }),
      ),
    );
  }

  return deet;
}

export async function createEmailAddress(opts: {
  ownerId: number;
  notes?: string;
  label?: string;
  isPrimary?: boolean;
  emailAddress?: string;
  sharedWith?: Array<number>;
}) {
  const deet = await Deets.create({
    owner_id: opts.ownerId,
    notes: opts.notes || '',
    label: opts.label || faker.random.word(),
    is_primary: !!opts.isPrimary,
    type: 'email_address',
  });

  const email = await EmailAddresses.create({
    deet_id: deet.id,
    email_address: opts.emailAddress || faker.internet.email(),
  });

  deet.email_address = email;

  if (opts.sharedWith) {
    await Promise.all(
      opts.sharedWith.map(userId =>
        SharedDeets.create({
          deet_id: deet.id,
          shared_with: userId,
        }),
      ),
    );
  }

  return deet;
}

export async function createFriendship(user1: Users, user2: Users) {
  await Promise.all([
    Friendships.create({
      first_user: user1.id,
      second_user: user2.id,
    }),
    Friendships.create({
      first_user: user2.id,
      second_user: user1.id,
    }),
  ]);
}

export async function requestFriend(requester: Users, target: Users) {
  await FriendRequests.create({
    target_user: target.id,
    requested_by: requester.id,
  });
}

export async function blockUser(blocker: Users, target: Users) {
  await BlockedUsers.create({
    target_user: target.id,
    blocked_by: blocker.id,
  });
}

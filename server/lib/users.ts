import { Users } from 'server/models';

export const getFullName = (user: Users) =>
  user.family_name ? user.given_name + ' ' + user.family_name : user.given_name;

import * as express from 'express';
import { GraphQLList } from 'graphql';
import { Addresses, EmailAddresses, PhoneNumbers } from 'server/models';
import contactInfoType from '../types/contactInfoType';
import { AuthenticationError } from 'apollo-server';

export default {
  description: 'The currently authed user',
  type: new GraphQLList(contactInfoType),
  async resolve(_1: any, _2: any, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }
    const [addresses, emails, phoneNumbers] = await Promise.all([
      Addresses.findAll({
        where: { owner_id: user.id },
      }),
      EmailAddresses.findAll({
        where: { owner_id: user.id },
      }),
      PhoneNumbers.findAll({
        where: { owner_id: user.id },
      }),
    ]);

    return [...addresses, ...emails, ...phoneNumbers];
  },
};

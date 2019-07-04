import * as express from 'express';
import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { EmailAddresses, Addresses, PhoneNumbers } from 'server/models';
import { ContactInfoTypes } from 'server/models/types';
import contactInfoType from '../types/contactInfoType';

interface Args {
  id: number;
  type: ContactInfoTypes;
}

export default {
  description: 'Upsert a phone number record',
  type: contactInfoType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    type: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_: any, { id, type }: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    let entry;
    switch (type) {
      case 'address':
        entry = await Addresses.findByPk(id);
        break;
      case 'phone_number':
        entry = await PhoneNumbers.findByPk(id);
        break;
      case 'email_address':
        entry = await EmailAddresses.findByPk(id);
        break;
      default:
        throw new UserInputError('Invalid type');
    }

    if (!entry || entry.owner_id !== user.id) {
      throw new UserInputError('Contact info not found');
    }

    await entry.destroy();

    return entry;
  },
};

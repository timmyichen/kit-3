import * as express from 'express';
import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server';
import { PhoneNumbers } from 'server/models';
import phoneNumberType from '../types/phoneNumberType';

interface Args {
  id?: number;
  notes?: string;
  label: string;
  countryCode?: string;
  phoneNumber: string;
}

export default {
  description: 'Upsert a phone number record',
  type: phoneNumberType,
  args: {
    id: { type: GraphQLInt },
    notes: { type: GraphQLString },
    label: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    countryCode: { type: GraphQLString },
  },
  async resolve(_: any, args: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    let result;
    const { notes, label } = args;

    if (args.id) {
      const entry = await PhoneNumbers.findByPk(args.id);

      if (!entry || entry.owner_id !== user.id) {
        throw new UserInputError('Phone number not found');
      }

      try {
        result = await entry.update({
          notes,
          label,
          phone_number: args.phoneNumber,
          country_code: args.countryCode,
        });
      } catch (e) {
        if (e.message.toLowerCase().includes('validation')) {
          throw new UserInputError(e.message);
        } else {
          throw new ApolloError(e.message);
        }
      }

      return result;
    }

    try {
      result = await PhoneNumbers.create({
        owner_id: user.id,
        notes,
        label,
        phone_number: args.phoneNumber,
        country_code: args.countryCode,
      });
    } catch (e) {
      if (e.message.toLowerCase().includes('validation')) {
        throw new UserInputError(e.message);
      } else {
        throw new ApolloError(e.message);
      }
    }

    return result;
  },
};

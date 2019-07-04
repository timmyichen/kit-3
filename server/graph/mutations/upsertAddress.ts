import * as express from 'express';
import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server';
import { Addresses, ContactInfos } from 'server/models';
import addressType from '../types/addressType';
import { db } from 'server/lib/db';

interface Args {
  id?: number;
  notes?: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode: string;
}

export default {
  description: 'Upsert an address record',
  type: addressType,
  args: {
    id: { type: GraphQLInt },
    notes: { type: GraphQLString },
    label: { type: new GraphQLNonNull(GraphQLString) },
    addressLine1: { type: new GraphQLNonNull(GraphQLString) },
    addressLine2: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    postalCode: { type: GraphQLString },
    countryCode: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_: any, args: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    let result;
    const { notes, label, city, state } = args;

    if (args.id) {
      const entry = await Addresses.findByPk(args.id);

      if (!entry || entry.owner_id !== user.id) {
        throw new UserInputError('Address not found');
      }

      try {
        result = await entry.update({
          notes,
          label,
          city,
          state,
          address_line_1: args.addressLine1,
          address_line_2: args.addressLine2,
          postal_code: args.postalCode,
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

    await db.transaction(async (transaction: any) => {
      const contactInfo = await ContactInfos.create(
        {
          type: 'address',
        },
        { transaction },
      );

      try {
        result = await Addresses.create(
          {
            owner_id: user.id,
            notes,
            label,
            city,
            state,
            address_line_1: args.addressLine1,
            address_line_2: args.addressLine2,
            postal_code: args.postalCode,
            country_code: args.countryCode,
            info_id: contactInfo.id,
          },
          { transaction },
        );
      } catch (e) {
        if (e.message.toLowerCase().includes('validation')) {
          throw new UserInputError(e.message);
        } else {
          throw new ApolloError(e.message);
        }
      }
    });

    return result;
  },
};

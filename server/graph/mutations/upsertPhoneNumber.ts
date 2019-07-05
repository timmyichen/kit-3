import * as express from 'express';
import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server';
import { PhoneNumbers, ContactInfos } from 'server/models';
import phoneNumberType from '../types/phoneNumberType';
import { db } from 'server/lib/db';

interface Args {
  infoId?: number;
  notes?: string;
  label: string;
  countryCode?: string;
  phoneNumber: string;
}

export default {
  description: 'Upsert a phone number record',
  type: phoneNumberType,
  args: {
    infoId: { type: GraphQLInt },
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

    if (args.infoId) {
      const info = await ContactInfos.findByPk(args.infoId);

      if (!info || info.owner_id !== user.id) {
        throw new UserInputError('Email address not found');
      }

      const entry = await info.getInfo({ where: { info_id: info.id } });

      if (!entry) {
        throw new ApolloError(`Matching info entry not found for ${info.id}`);
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

    await db.transaction(async (transaction: any) => {
      const contactInfo = await ContactInfos.create(
        {
          type: 'phone_number',
          owner_id: user.id,
        },
        { transaction },
      );

      try {
        result = await PhoneNumbers.create(
          {
            notes,
            label,
            phone_number: args.phoneNumber,
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

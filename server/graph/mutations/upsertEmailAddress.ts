import * as express from 'express';
import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server';
import { EmailAddresses, ContactInfos } from 'server/models';
import emailAddressType from '../types/emailAddressType';
import { db } from 'server/lib/db';

interface Args {
  id?: number;
  notes?: string;
  label: string;
  emailAddress: string;
}

export default {
  description: 'Upsert a phone number record',
  type: emailAddressType,
  args: {
    id: { type: GraphQLInt },
    notes: { type: GraphQLString },
    label: { type: new GraphQLNonNull(GraphQLString) },
    emailAddress: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_: any, args: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    let result;
    const { notes, label } = args;

    if (args.id) {
      const entry = await EmailAddresses.findByPk(args.id);

      if (!entry || entry.owner_id !== user.id) {
        throw new UserInputError('Email address not found');
      }

      try {
        result = await entry.update({
          notes,
          label,
          email_address: args.emailAddress,
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
        result = await EmailAddresses.create(
          {
            owner_id: user.id,
            notes,
            label,
            email_address: args.emailAddress,
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

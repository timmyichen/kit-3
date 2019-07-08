import * as express from 'express';
import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server';
import { EmailAddresses, Deets } from 'server/models';
import emailAddressType from '../types/emailAddressType';
import { db } from 'server/lib/db';

interface Args {
  deetId?: number;
  notes?: string;
  label: string;
  emailAddress: string;
}

export default {
  description: 'Upsert a phone number record',
  type: emailAddressType,
  args: {
    deetId: { type: GraphQLInt },
    notes: { type: GraphQLString },
    label: { type: new GraphQLNonNull(GraphQLString) },
    emailAddress: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_: any, args: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const { notes, label } = args;

    if (args.deetId) {
      let result;
      const deet = await Deets.findByPk(args.deetId);

      if (!deet || deet.owner_id !== user.id) {
        throw new UserInputError('Email address not found');
      }

      const entry = await deet.getDeet({ where: { deet_id: deet.id } });

      if (!entry) {
        throw new ApolloError(`Matching deet entry not found for ${deet.id}`);
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

      return {
        ...deet.get({ plain: true }),
        email_address: {
          ...result.get({ plain: true }),
        },
      };
    }

    let deet: { [s: string]: any } = {};
    let result: { get?: any } = {};

    await db.transaction(async (transaction: any) => {
      deet = await Deets.create(
        {
          type: 'email_address',
          owner_id: user.id,
          notes,
          label,
        },
        { transaction },
      );

      try {
        result = await EmailAddresses.create(
          {
            email_address: args.emailAddress,
            deet_id: deet.id,
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

    return {
      ...deet.get({ plain: true }),
      email_address: {
        ...result.get({ plain: true }),
      },
    };
  },
};

import * as express from 'express';
import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server';
import { PhoneNumbers, Deets } from 'server/models';
import phoneNumberType from '../types/phoneNumberType';
import { db } from 'server/lib/db';
import { getPlainDeetObject } from 'server/lib/model';
import { DeetType, Deet } from 'server/models/types';

interface Args {
  deetId?: number;
  notes: string;
  label: string;
  countryCode: string;
  phoneNumber: string;
}

export default {
  description: 'Upsert a phone number record',
  type: phoneNumberType,
  args: {
    deetId: { type: GraphQLInt },
    notes: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    countryCode: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_: any, args: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const { notes, label } = args;

    if (args.deetId) {
      let result: Deet | null = null;
      const deet = await Deets.findByPk(args.deetId);

      if (!deet || deet.owner_id !== user.id) {
        throw new UserInputError('Email address not found');
      }

      const entry = await deet.getDeet({ where: { deet_id: deet.id } });

      if (!entry) {
        throw new ApolloError(`Matching deet entry not found for ${deet.id}`);
      }

      let updatedDeet;

      await db.transaction(async (transaction: any) => {
        try {
          // @ts-ignore
          [updatedDeet, result] = await Promise.all([
            deet.update(
              {
                notes,
                label,
              },
              { transaction },
            ),
            entry.update(
              {
                phone_number: args.phoneNumber,
                country_code: args.countryCode,
              },
              { transaction },
            ),
          ]);
        } catch (e) {
          if (e.message.toLowerCase().includes('validation')) {
            throw new UserInputError(e.message);
          } else {
            throw new ApolloError(e.message);
          }
        }
      });

      if (!result || !updatedDeet) {
        throw new Error('Something went wrong.');
      }

      return {
        ...deet.get({ plain: true }),
        phone_number: {
          ...(result as Deet).get({ plain: true }),
        },
      };
    }

    let deet: { [s: string]: any } = {};
    let result: { get?: any } = {};

    await db.transaction(async (transaction: any) => {
      deet = await Deets.create(
        {
          type: 'phone_number',
          owner_id: user.id,
          notes,
          label,
        },
        { transaction },
      );

      try {
        result = await PhoneNumbers.create(
          {
            phone_number: args.phoneNumber,
            country_code: args.countryCode,
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

    return getPlainDeetObject(deet as DeetType, result as Deet);
  },
};

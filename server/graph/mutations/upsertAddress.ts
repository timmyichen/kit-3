import * as express from 'express';
import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server';
import { Addresses, Deets } from 'server/models';
import addressType from '../types/addressType';
import { db } from 'server/lib/db';
import { getPlainDeetObject } from 'server/lib/model';
import { DeetType, Deet } from 'server/models/types';

interface Args {
  deetId?: number;
  notes: string;
  label: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  isPrimary: boolean;
}

export default {
  description: 'Upsert an address record',
  type: new GraphQLNonNull(addressType),
  args: {
    deetId: { type: GraphQLInt },
    notes: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    addressLine1: { type: new GraphQLNonNull(GraphQLString) },
    addressLine2: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    state: { type: new GraphQLNonNull(GraphQLString) },
    postalCode: { type: new GraphQLNonNull(GraphQLString) },
    countryCode: { type: new GraphQLNonNull(GraphQLString) },
    isPrimary: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  async resolve(_: any, args: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const { notes, label, city, state, isPrimary } = args;

    if (args.deetId) {
      let result: Deet | null = null;
      const deet = await Deets.findByPk(args.deetId);

      if (!deet || deet.owner_id !== user.id) {
        throw new UserInputError('Address not found');
      }

      const entry = await deet.getDeet({ where: { deet_id: deet.id } });

      if (!entry) {
        throw new ApolloError(`Matching deet entry not found for ${deet.id}`);
      }

      let updatedDeet;

      await db.transaction(async (transaction: any) => {
        try {
          if (isPrimary) {
            await Deets.update(
              { is_primary: false },
              {
                where: { owner_id: user.id, type: 'address' },
                transaction,
                // @ts-ignore silent not recognized for some reason
                silent: true,
              },
            );
          }

          // @ts-ignore something about bluebird promises
          [updatedDeet, result] = await Promise.all([
            deet.update(
              {
                label,
                notes,
                is_primary: isPrimary,
              },
              { transaction },
            ),
            entry.update(
              {
                city,
                state,
                address_line_1: args.addressLine1,
                address_line_2: args.addressLine2,
                postal_code: args.postalCode,
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
        address: {
          ...(result as Deet).get({ plain: true }),
        },
      };
    }

    let deet: { [s: string]: any } = {};
    let result: { get?: any } = {};

    await db.transaction(async (transaction: any) => {
      if (isPrimary) {
        await Deets.update(
          { is_primary: false },
          {
            where: { owner_id: user.id, type: 'address' },
            transaction,
            // @ts-ignore silent not recognized for some reason
            silent: true,
          },
        );
      }

      deet = await Deets.create(
        {
          type: 'address',
          owner_id: user.id,
          notes,
          label,
          is_primary: isPrimary,
          verified_at: new Date(),
        },
        { transaction },
      );

      try {
        result = await Addresses.create(
          {
            city,
            state,
            address_line_1: args.addressLine1,
            address_line_2: args.addressLine2,
            postal_code: args.postalCode,
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

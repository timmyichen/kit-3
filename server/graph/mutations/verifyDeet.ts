import * as express from 'express';
import { GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { Deets } from 'server/models';
import deetType from '../types/deetType';

interface Args {
  deetId: number;
}

export default {
  description: 'Verifies a deet',
  type: new GraphQLNonNull(deetType),
  args: {
    deetId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  async resolve(_: any, { deetId }: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const deet = await Deets.findByPk(deetId);

    if (!deet || deet.owner_id !== user.id) {
      throw new UserInputError('Deet not found');
    }

    await deet.update({ verified_at: new Date() });

    return deet;
  },
};

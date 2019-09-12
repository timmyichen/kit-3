import { GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { Deets, SharedDeets } from 'server/models';
import deetType from '../types/deetType';
import { db } from 'server/lib/db';
import { getPlainDeetObject } from 'server/lib/model';
import { DeetType, Deet } from 'server/models/types';
import { GraphQLContext } from 'server/routers/graphql';

interface Args {
  deetId: number;
}

export default {
  description: 'Upsert a phone number record',
  type: new GraphQLNonNull(deetType),
  args: {
    deetId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  async resolve(_: any, { deetId }: Args, { user }: GraphQLContext) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const deet = await Deets.findByPk(deetId);

    if (!deet || deet.owner_id !== user.id) {
      throw new UserInputError('Deet not found');
    }

    const entry = await deet.getDeet();

    if (!entry) {
      throw new UserInputError('Deet not found');
    }

    await db.transaction(async (transaction: any) => {
      await Promise.all([
        entry!.destroy({ transaction }),
        SharedDeets.destroy({
          where: { deet_id: deet.id },
          transaction,
        }),
      ]);
      await deet.destroy({ transaction });
    });

    return getPlainDeetObject(deet as DeetType, entry as Deet);
  },
};

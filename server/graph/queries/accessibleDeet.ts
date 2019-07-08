import * as express from 'express';
import { GraphQLList, GraphQLString } from 'graphql';
import deetType from '../types/deetType';
import { DeetTypes } from 'server/models/types';
import { AuthenticationError } from 'apollo-server';
import { Deets, SharedDeets } from 'server/models';
import { Op, Filterable } from 'sequelize';

interface Args {
  type: DeetTypes;
}

export default {
  description: 'Deets accessible to the currently authed user',
  type: new GraphQLList(deetType),
  args: {
    type: { type: GraphQLString },
  },
  async resolve(_1: any, args: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const sharedWithUser = await SharedDeets.findAll({
      where: { shared_with: user.id },
    });

    const where: Filterable['where'] = {
      id: { [Op.in]: sharedWithUser.map(i => i.deet_id) },
    };

    if (args.type) {
      where.type = args.type;
    }

    const deets = await Deets.findAll({ where });

    const promises: Array<Promise<any> | undefined> = deets.map((deet: Deets) =>
      deet.getDeet({ where: { deet_id: deet.id } }),
    );

    const result = await Promise.all(promises);

    return result;
  },
};

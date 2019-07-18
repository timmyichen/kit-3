import { GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import deetType from '../types/deetType';
import { DeetTypes, Deet } from 'server/models/types';
import { AuthenticationError } from 'apollo-server';
import {
  Deets,
  SharedDeets,
  Addresses,
  EmailAddresses,
  PhoneNumbers,
} from 'server/models';
import { ReqWithLoader } from 'server/lib/loader';
import paginationType from './lib/paginationType';
import paginate from './lib/paginate';
import { Op, Filterable } from 'sequelize';

interface Args {
  type?: DeetTypes;
  count?: number;
  after?: string;
}

export default {
  description: 'Deets accessible to the currently authed user',
  type: new GraphQLNonNull(
    paginationType({ name: 'SharedDeets', type: deetType }),
  ),
  args: {
    type: { type: GraphQLString },
    count: { type: GraphQLInt },
    after: { type: GraphQLString },
  },
  async resolve(_: any, args: Args, { user, loader }: ReqWithLoader) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const sharedWithUser: Array<SharedDeets> = await loader(
      SharedDeets,
    ).loadManyBy('shared_with', user.id);

    const deetIds = sharedWithUser.map(d => d.deet_id);

    const where: Filterable['where'] = {
      id: { [Op.in]: deetIds },
    };

    if (args.after) {
      where.updated_at = {
        [Op.lte]: new Date(parseInt(args.after, 10)).toISOString(),
      };
    }

    if (args.type) {
      where.type = args.type;
    }

    const paginatedDeets = await paginate({
      model: Deets,
      where,
      count: args.count || 20,
    });

    const allDeets = paginatedDeets.items.reduce(
      (obj: { [n: number]: Deet }, d: Deet) => ({
        ...obj,
        [d.id]: d,
      }),
      {},
    );

    const promises: Array<Promise<Deet>> = Object.values(allDeets).map(
      (deet: Deets) => {
        switch (deet.type) {
          case 'address':
            return loader(Addresses).loadBy('deet_id', deet.id);
          case 'email_address':
            return loader(EmailAddresses).loadBy('deet_id', deet.id);
          case 'phone_number':
            return loader(PhoneNumbers).loadBy('deet_id', deet.id);
          default:
            throw new Error('unrecognized deet ' + deet.type);
        }
      },
    );

    const results = await Promise.all(promises);

    for (const result of results) {
      if (!result) {
        continue;
      }
      allDeets[result.deet_id][result.getType()] = result.get({ simple: true });
    }

    return {
      ...paginatedDeets,
      items: Object.values(allDeets),
    };
  },
};

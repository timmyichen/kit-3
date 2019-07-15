import { GraphQLList, GraphQLString } from 'graphql';
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

interface Args {
  type?: DeetTypes;
}

export default {
  description: 'Deets accessible to the currently authed user',
  type: new GraphQLList(deetType),
  args: {
    type: { type: GraphQLString },
  },
  async resolve(_: any, args: Args, { user, loader }: ReqWithLoader) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const sharedWithUser: Array<SharedDeets> = await loader(
      SharedDeets,
    ).loadManyBy('shared_with', user.id);

    const opts: { type?: string } = {};
    if (args.type) {
      opts.type = args.type;
    }

    const deets = (await Promise.all(
      sharedWithUser.map(i => loader(Deets).loadBy('id', i.deet_id, opts)),
    )).reduce(
      (obj, d) => ({
        ...obj,
        [d.id]: d,
      }),
      {},
    );

    const promises: Array<Promise<Deet>> = Object.values(deets).map(
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
      deets[result.deet_id][result.getType()] = result.get({ simple: true });
    }

    return Object.values(deets);
  },
};

import { GraphQLList, GraphQLNonNull } from 'graphql';
import { Addresses, EmailAddresses, PhoneNumbers, Deets } from 'server/models';
import { AuthenticationError } from 'apollo-server';
import deetType from '../types/deetType';
import { GraphQLContext } from 'server/routers/graphql';

export default {
  description: 'Get all deets owned by a user',
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(deetType))),
  async resolve(_1: any, _2: any, { user }: GraphQLContext) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const deets = await Deets.findAll({
      where: { owner_id: user.id },
      include: [
        { model: Addresses },
        { model: EmailAddresses },
        { model: PhoneNumbers },
      ],
    });

    return deets.map(deet => deet.get({ plain: true }));
  },
};

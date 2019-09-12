import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { Op } from 'sequelize';
import userFields from './userFields';
import { UserInputError, ApolloError } from 'apollo-server';
import {
  Users,
  Deets,
  SharedDeets,
  Addresses,
  EmailAddresses,
  PhoneNumbers,
} from 'server/models';
import deetType from './deetType';
import { GraphQLContext } from 'server/routers/graphql';

const friendType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Friend',
  description: 'A user who is a friend',
  fields: () => ({
    ...userFields,
    birthdayDate: {
      type: GraphQLString,
      resolve: async (user: Users) => user.birthday_date,
    },
    birthdayYear: {
      type: GraphQLString,
      resolve: async (user: Users) => user.birthday_year,
    },
    birthday: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: any) => {
        if (!user.birthday_date || !user.birthday_year) {
          throw new ApolloError('no birthday found');
        }

        const [, month, date] = user.birthday_date.split('-');
        return [user.birthday_year, month, date].join('-');
      },
    },
    hasAccessToDeet: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        deetId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(
        u: Users,
        { deetId }: { deetId: number },
        { user, loader }: GraphQLContext,
      ) {
        if (!deetId) {
          throw new UserInputError('Missing id');
        }

        const deet = await loader(Deets).loadBy('id', deetId);

        if (!deet || deet.owner_id !== user.id) {
          throw new UserInputError('Deet not found');
        }

        return !!(await loader(SharedDeets).loadBy('deet_id', deet.id, {
          shared_with: u.id,
        }));
      },
    },
    viewableDeets: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(deetType))),
      async resolve(u: Users, _: any, { user, loader }: GraphQLContext) {
        const sharedDeets = await loader(SharedDeets).loadManyBy(
          'shared_with',
          u.id,
        );

        const deetIds = sharedDeets.map((d: SharedDeets) => d.deet_id);

        const deetObjs = await Deets.findAll({
          where: {
            id: { [Op.in]: deetIds },
            owner_id: user.id,
          },
          include: [
            { model: Addresses },
            { model: EmailAddresses },
            { model: PhoneNumbers },
          ],
        });

        return deetObjs;
      },
    },
    sharedDeets: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(deetType))),
      async resolve(u: Users, _: any, { user, loader }: GraphQLContext) {
        const sharedDeets = await loader(SharedDeets).loadManyBy(
          'shared_with',
          user.id,
        );

        const deetIds = sharedDeets.map((d: SharedDeets) => d.deet_id);

        const deetObjs = await Deets.findAll({
          where: {
            id: { [Op.in]: deetIds },
            owner_id: u.id,
          },
          include: [
            { model: Addresses },
            { model: EmailAddresses },
            { model: PhoneNumbers },
          ],
        });

        return deetObjs;
      },
    },
  }),
});

export default friendType;

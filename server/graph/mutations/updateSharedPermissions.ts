import { GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server';
import { Friendships, Deets, SharedDeets, Users } from 'server/models';
import { db } from 'server/lib/db';
import friendType from '../types/friendType';
import { ReqWithLoader } from 'server/lib/loader';

type Args = {
  deetId: number;
  userIdsToAdd: Array<number>;
  userIdsToRemove: Array<number>;
};

export default {
  description: 'Update permissions for shared',
  type: new GraphQLList(friendType),
  args: {
    deetId: { type: new GraphQLNonNull(GraphQLInt) },
    userIdsToAdd: { type: new GraphQLList(GraphQLInt) },
    userIdsToRemove: { type: new GraphQLList(GraphQLInt) },
  },
  async resolve(_: any, args: Args, { user, loader }: ReqWithLoader) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const deet = await Deets.findByPk(args.deetId);

    if (!deet || deet.owner_id !== user.id) {
      throw new UserInputError('Email address not found');
    }

    if (
      args.userIdsToAdd.includes(user.id) ||
      args.userIdsToRemove.includes(user.id)
    ) {
      throw new UserInputError('Cannot add/remove self');
    }

    const allIds = args.userIdsToAdd.concat(args.userIdsToRemove);
    const unique = [...new Set(allIds)];
    if (unique.length !== allIds.length) {
      throw new UserInputError(
        'Cannot add and remove same user at the same time',
      );
    }

    const entry = await deet.getDeet();

    if (!entry) {
      throw new ApolloError(`Matching deet entry not found for ${deet.id}`);
    }

    const usersToAdd = await Friendships.findAll({
      where: {
        first_user: { [Op.in]: args.userIdsToAdd },
        second_user: user.id,
      },
    });

    if (usersToAdd.length !== args.userIdsToAdd.length) {
      throw new UserInputError('Cannot add non-friends');
    }

    const dataToUpsert = args.userIdsToAdd.map(shared_with => ({
      shared_with,
      deet_id: args.deetId,
    }));

    await db.transaction((transaction: any) =>
      Promise.all([
        SharedDeets.bulkCreate(dataToUpsert, {
          ignoreDuplicates: true,
          transaction,
        }),
        SharedDeets.destroy({
          where: { shared_with: { [Op.in]: args.userIdsToRemove } },
        }),
      ]),
    );

    const affectedUsers = await Promise.all(
      allIds.map(id => loader(Users).loadBy('id', id)),
    );

    return affectedUsers;
  },
};

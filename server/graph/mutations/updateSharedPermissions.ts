import * as express from 'express';
import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';
import { Op } from 'sequelize';
import {
  AuthenticationError,
  UserInputError,
  ApolloError,
} from 'apollo-server';
import { Friendships, ContactInfos, SharedContactInfos } from 'server/models';
import { db } from 'server/lib/db';

type Args = {
  infoId: number;
  userIdsToAdd: Array<number>;
  userIdsToRemove: Array<number>;
};

export default {
  description: 'Update permissions for shared',
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    infoId: { type: new GraphQLNonNull(GraphQLInt) },
    userIdsToAdd: { type: new GraphQLList(GraphQLInt) },
    userIdsToRemove: { type: new GraphQLList(GraphQLInt) },
  },
  async resolve(_: any, args: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const info = await ContactInfos.findByPk(args.infoId);

    if (!info || info.owner_id !== user.id) {
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

    const entry = await info.getInfo({ where: { info_id: info.id } });

    if (!entry) {
      throw new ApolloError(`Matching info entry not found for ${info.id}`);
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
      info_id: args.infoId,
    }));

    await db.transaction((transaction: any) =>
      Promise.all([
        SharedContactInfos.bulkCreate(dataToUpsert, {
          ignoreDuplicates: true,
          transaction,
        }),
        SharedContactInfos.destroy({
          where: { shared_with: { [Op.in]: args.userIdsToRemove } },
        }),
      ]),
    );

    return true;
  },
};

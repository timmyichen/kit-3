import * as express from 'express';
import { GraphQLList, GraphQLString } from 'graphql';
import contactInfoType from '../types/contactInfoType';
import { ContactInfoTypes } from 'server/models/types';
import { AuthenticationError } from 'apollo-server';
import { ContactInfos, SharedContactInfos } from 'server/models';
import { Op, Filterable } from 'sequelize';

interface Args {
  type: ContactInfoTypes;
}

export default {
  description: 'The currently authed user',
  type: new GraphQLList(contactInfoType),
  args: {
    type: { type: GraphQLString },
  },
  async resolve(_1: any, args: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const sharedWithUser = await SharedContactInfos.findAll({
      where: { shared_with: user.id },
    });

    const where: Filterable['where'] = {
      id: { [Op.in]: sharedWithUser.map(i => i.info_id) },
    };

    if (args.type) {
      where.type = args.type;
    }

    const infos = await ContactInfos.findAll({ where });

    const promises: Array<Promise<any>> = infos.map(info =>
      info.getInfo({ where: { info_id: info.id } }),
    );

    const result = await Promise.all(promises);

    return result;
  },
};

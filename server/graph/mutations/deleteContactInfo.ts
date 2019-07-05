import * as express from 'express';
import { GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { ContactInfos } from 'server/models';
import contactInfoType from '../types/contactInfoType';
import { db } from 'server/lib/db';

interface Args {
  infoId: number;
}

export default {
  description: 'Upsert a phone number record',
  type: contactInfoType,
  args: {
    infoId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  async resolve(_: any, { infoId }: Args, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const info = await ContactInfos.findByPk(infoId);

    if (!info || info.owner_id !== user.id) {
      throw new UserInputError('Info not found');
    }

    const entry = await info.getInfo({ where: { info_id: info.id } });

    if (!entry) {
      throw new UserInputError('Contact info not found');
    }

    await db.transaction(async (transaction: any) => {
      await entry!.destroy({ transaction });
      await info.destroy({ transaction });
    });

    return entry;
  },
};

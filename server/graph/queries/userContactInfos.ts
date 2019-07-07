import * as express from 'express';
import { GraphQLList } from 'graphql';
import {
  Addresses,
  EmailAddresses,
  PhoneNumbers,
  ContactInfos,
} from 'server/models';
import { AuthenticationError } from 'apollo-server';
import contactInfoType from '../types/contactInfoType';

export default {
  description: 'The currently authed user',
  type: new GraphQLList(contactInfoType),
  async resolve(_1: any, _2: any, { user }: express.Request) {
    if (!user) {
      throw new AuthenticationError('Must be logged in');
    }

    const infos = await ContactInfos.findAll({
      where: { owner_id: user.id },
      include: [
        { model: Addresses },
        { model: EmailAddresses },
        { model: PhoneNumbers },
      ],
    });

    return infos.map(info => info.get({ plain: true }));
  },
};

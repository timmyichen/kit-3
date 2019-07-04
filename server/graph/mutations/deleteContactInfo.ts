import * as express from 'express';
import { GraphQLNonNull, GraphQLInt } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import {
  EmailAddresses,
  Addresses,
  PhoneNumbers,
  ContactInfos,
} from 'server/models';
import contactInfoType from '../types/contactInfoType';
import { db } from 'server/lib/db';

interface Args {
  infoId: number;
}

type AnyContactInfo = EmailAddresses | Addresses | PhoneNumbers;

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

    const contactInfo = await ContactInfos.findByPk(infoId);

    if (!contactInfo) {
      throw new UserInputError('Info not found');
    }

    let entry: AnyContactInfo | null;
    switch (contactInfo.type) {
      case 'address':
        entry = await Addresses.findOne({ where: { info_id: contactInfo.id } });
        break;
      case 'phone_number':
        entry = await PhoneNumbers.findOne({
          where: { info_id: contactInfo.id },
        });
        break;
      case 'email_address':
        entry = await EmailAddresses.findOne({
          where: { info_id: contactInfo.id },
        });
        break;
      default:
        throw new UserInputError('Invalid type');
    }

    if (!entry || entry.owner_id !== user.id) {
      throw new UserInputError('Contact info not found');
    }

    await db.transaction(async (transaction: any) => {
      await entry!.destroy({ transaction });
      await contactInfo.destroy({ transaction });
    });

    return entry;
  },
};

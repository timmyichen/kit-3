import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import { Users } from 'server/models';
import friendType from './friendType';
import { commonDeetFields, timestamps } from './common';

export default new GraphQLObjectType({
  name: 'PhoneNumberDeet',
  description: 'A phone number deet',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (num: any) => num.id,
    },
    owner: {
      type: new GraphQLNonNull(friendType),
      resolve: (num: any, _, { loader }) =>
        loader(Users).loadBy('id', num.owner_id),
    },
    countryCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (num: any) => num.phone_number.country_code,
    },
    phoneNumber: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (num: any) => num.phone_number.phone_number,
    },
    ...commonDeetFields(),
    ...timestamps({ verified: true }),
  }),
});

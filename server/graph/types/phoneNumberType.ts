import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import { Users } from 'server/models';
import userType from './userType';
import { commonInfoFields, timestamps } from './common';

export default new GraphQLObjectType({
  name: 'PhoneNumberContactInfo',
  description: 'A phone number contact info',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (num: any) => num.id,
    },
    owner: {
      type: new GraphQLNonNull(userType),
      resolve: (num: any) => Users.findByPk(num.owner_id),
    },
    countryCode: {
      type: GraphQLString,
      resolve: (num: any) => num.country_code,
    },
    number: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (num: any) => num.phone_number,
    },
    ...commonInfoFields(),
    ...timestamps(),
  }),
});

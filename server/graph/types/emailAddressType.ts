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
  name: 'EmailAddressContactInfo',
  description: 'An email address contact info',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (email: any) => email.id,
    },
    owner: {
      type: new GraphQLNonNull(userType),
      resolve: (email: any) => Users.findByPk(email.owner_id),
    },
    emailAddress: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (email: any) => email.email_address.email_address,
    },
    ...commonInfoFields(),
    ...timestamps(),
  }),
});

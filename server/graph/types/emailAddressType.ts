import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import { Users } from 'server/models';
import userType from './userType';
import { commonDeetFields, timestamps } from './common';

export default new GraphQLObjectType({
  name: 'EmailAddressDeet',
  description: 'An email addressdeet',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (email: any) => email.id,
    },
    owner: {
      type: new GraphQLNonNull(userType),
      resolve: (email: any, _, { loader }) =>
        loader(Users).loadBy('id', email.owner_id),
    },
    emailAddress: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (email: any) => email.email_address.email_address,
    },
    ...commonDeetFields(),
    ...timestamps(),
  }),
});

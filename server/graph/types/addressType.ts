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
  name: 'AddressDeet',
  description: 'A physical address deet',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (address: any) => address.id,
    },
    owner: {
      type: new GraphQLNonNull(userType),
      resolve: (address: any, _, { loader }) =>
        loader(Users).loadBy('id', address.owner_id),
    },
    addressLine1: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (address: any) => address.address.address_line_1,
    },
    addressLine2: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (address: any) => address.address.address_line_2,
    },
    city: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (address: any) => address.address.city,
    },
    state: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (address: any) => address.address.state,
    },
    postalCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (address: any) => address.address.postal_code,
    },
    country: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (address: any) => address.address.country_code,
    },
    ...commonDeetFields(),
    ...timestamps({ verified: true }),
  }),
});

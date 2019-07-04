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
  name: 'AddressContactInfo',
  description: 'A physical address contact info',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (address: any) => address.id,
    },
    owner: {
      type: new GraphQLNonNull(userType),
      resolve: (address: any) => Users.findByPk(address.owner_id),
    },
    addressLine1: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (address: any) => address.address_line_1,
    },
    addressLine2: {
      type: GraphQLString,
      resolve: (address: any) => address.address_line_2,
    },
    city: {
      type: GraphQLString,
      resolve: (address: any) => address.city,
    },
    state: {
      type: GraphQLString,
      resolve: (address: any) => address.state,
    },
    postalCode: {
      type: GraphQLString,
      resolve: (address: any) => address.postal_code,
    },
    countryCode: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (address: any) => address.country_code,
    },
    ...commonInfoFields(),
    ...timestamps(),
  }),
});

import { GraphQLEnumType } from 'graphql';

const types = ['address', 'email_address', 'phone_number'];

export default new GraphQLEnumType({
  name: 'DeetType',
  values: types.reduce((o, t) => ({ ...o, [t]: { value: t } }), {}),
});

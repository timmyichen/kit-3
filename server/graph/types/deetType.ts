import { GraphQLUnionType } from 'graphql';
import emailAddressType from './emailAddressType';
import phoneNumberType from './phoneNumberType';
import addressType from './addressType';

export default new GraphQLUnionType({
  name: 'Deet',
  types: [emailAddressType, phoneNumberType, addressType],
  resolveType(obj) {
    switch (obj.type) {
      case 'address':
        return addressType;
      case 'email_address':
        return emailAddressType;
      case 'phone_number':
        return phoneNumberType;
      default:
        throw new Error(`Deet type ${obj.type} not recognized`);
    }
  },
});

import { GraphQLUnionType } from 'graphql';
import emailAddressType from './emailAddressType';
import phoneNumberType from './phoneNumberType';
import addressType from './addressType';

export default new GraphQLUnionType({
  name: 'ContactInfo',
  types: [emailAddressType, phoneNumberType, addressType],
  resolveType(obj) {
    if (obj.address_line_1) {
      return addressType;
    } else if (obj.email_address) {
      return emailAddressType;
    } else if (obj.phone_number) {
      return phoneNumberType;
    }

    return null;
  },
});

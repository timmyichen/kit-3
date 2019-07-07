export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string;
      name: string;
      possibleTypes: {
        name: string;
      }[];
    }[];
  };
}

const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: 'UNION',
        name: 'ContactInfo',
        possibleTypes: [
          {
            name: 'EmailAddressContactInfo',
          },
          {
            name: 'PhoneNumberContactInfo',
          },
          {
            name: 'AddressContactInfo',
          },
        ],
      },
    ],
  },
};

export default result;

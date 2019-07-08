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
        name: 'Deet',
        possibleTypes: [
          {
            name: 'EmailAddressDeet',
          },
          {
            name: 'PhoneNumberDeet',
          },
          {
            name: 'AddressDeet',
          },
        ],
      },
    ],
  },
};

export default result;

import * as React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { CURRENT_USER_DEETS_QUERY } from 'client/graph/queries';
import {
  Deet,
  AddressDeet,
  EmailAddressDeet,
  PhoneNumberDeet,
} from 'client/types';
import { AddressCard } from './AddressCard';
import { EmailAddressCard } from './EmailAddressCard';
import { PhoneNumberCard } from './PhoneNumberCard';

export default function CurrentUserDeets() {
  const { data: deets, loading: loadingDeets } = useQuery(
    CURRENT_USER_DEETS_QUERY,
  );

  console.log(deets);

  return (
    <div className="current-user-deets">
      {!loadingDeets &&
        deets.userContactInfos.map((info: Deet) => {
          switch (info.__typename) {
            case 'AddressContactInfo':
              return <AddressCard address={info as AddressDeet} />;
            case 'EmailAddressContactInfo':
              return <EmailAddressCard email={info as EmailAddressDeet} />;
            case 'PhoneNumberContactInfo':
              return <PhoneNumberCard phoneNumber={info as PhoneNumberDeet} />;
          }
        })}
      <style jsx>{`
        .current-user-deets {
        }
      `}</style>
    </div>
  );
}

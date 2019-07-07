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

  return (
    <div className="current-user-deets">
      {!loadingDeets &&
        deets.userContactInfos.map((info: Deet) => {
          switch (info.__typename) {
            case 'AddressContactInfo':
              return (
                <AddressCard
                  key={`my-deets-${info.id}`}
                  address={info as AddressDeet}
                />
              );
            case 'EmailAddressContactInfo':
              return (
                <EmailAddressCard
                  key={`my-deets-${info.id}`}
                  email={info as EmailAddressDeet}
                />
              );
            case 'PhoneNumberContactInfo':
              return (
                <PhoneNumberCard
                  key={`my-deets-${info.id}`}
                  phoneNumber={info as PhoneNumberDeet}
                />
              );
          }
        })}
      <style jsx>{`
        .current-user-deets {
        }
      `}</style>
    </div>
  );
}

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
        deets.userDeets.map((deet: Deet) => {
          switch (deet.__typename) {
            case 'AddressDeet':
              return (
                <AddressCard
                  key={`my-deets-${deet.id}`}
                  address={deet as AddressDeet}
                />
              );
            case 'EmailAddressDeet':
              return (
                <EmailAddressCard
                  key={`my-deets-${deet.id}`}
                  email={deet as EmailAddressDeet}
                />
              );
            case 'PhoneNumberDeet':
              return (
                <PhoneNumberCard
                  key={`my-deets-${deet.id}`}
                  phoneNumber={deet as PhoneNumberDeet}
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

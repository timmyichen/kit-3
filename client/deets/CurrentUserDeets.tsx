import * as React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { CURRENT_USER_DEETS_QUERY } from 'client/graph/queries';
import {
  AddressDeet,
  EmailAddressDeet,
  PhoneNumberDeet,
  Deet,
} from 'client/types';
import { AddressCard } from './AddressCard';
import { EmailAddressCard } from './EmailAddressCard';
import { PhoneNumberCard } from './PhoneNumberCard';
import useWindowSize from 'client/hooks/useWindowSize';
import { isBrowser, splitColumns } from 'client/lib/dom';
import Loader from 'client/components/Loader';

const getDeetCard = (item: Deet) => {
  switch (item.__typename) {
    case 'AddressDeet':
      return (
        <div className="deet-item" key={`my-deets-${item.id}`}>
          <AddressCard address={item as AddressDeet} />
        </div>
      );
      break;
    case 'EmailAddressDeet':
      return (
        <div className="deet-item" key={`my-deets-${item.id}`}>
          <EmailAddressCard email={item as EmailAddressDeet} />
        </div>
      );
      break;
    case 'PhoneNumberDeet':
      return (
        <div className="deet-item" key={`my-deets-${item.id}`}>
          <PhoneNumberCard phoneNumber={item as PhoneNumberDeet} />
        </div>
      );
  }
};

function CurrentUserDeets() {
  const { data: deets, loading: loadingDeets } = useQuery(
    CURRENT_USER_DEETS_QUERY,
  );

  const [colCount, setColCount] = React.useState<number>(3);

  if (isBrowser) {
    const size = useWindowSize();
    React.useEffect(() => {
      const cols = size && size.width ? Math.floor(size.width / 350) : 3;
      setColCount(cols || 1);
    }, [size.width]);
  }

  if (loadingDeets) {
    return (
      <div className="current-user-deets">
        <Loader />
      </div>
    );
  }

  const deetCards = deets.userDeets.map(getDeetCard);

  const columns = splitColumns(deetCards, colCount);

  return (
    <div className="current-user-deets">
      {columns.map((col, i) => (
        <div className="column" key={`col-${i}`}>
          {col}
        </div>
      ))}
      <style jsx>{`
        .current-user-deets {
          display: flex;
          justify-content: space-around;
        }
        .current-user-deets :global(.deet-item) {
          padding: 15px;
        }
      `}</style>
    </div>
  );
}

export default CurrentUserDeets;

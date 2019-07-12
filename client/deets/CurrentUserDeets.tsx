import * as React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { CURRENT_USER_DEETS_QUERY } from 'client/graph/queries';
import { AddressDeet, EmailAddressDeet, PhoneNumberDeet } from 'client/types';
import { AddressCard } from './AddressCard';
import { EmailAddressCard } from './EmailAddressCard';
import { PhoneNumberCard } from './PhoneNumberCard';
import useWindowSize from 'client/hooks/useWindowSize';
import { isBrowser } from 'client/lib/dom';
import { Loader } from 'semantic-ui-react';

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

  const columns: Array<Array<React.ReactNode>> = [];
  for (let i = 0; i < deets.userDeets.length; i++) {
    if (!columns[i % colCount]) {
      columns[i % colCount] = [];
    }

    let deet: React.ReactNode | null;
    const item = deets.userDeets[i];
    switch (item.__typename) {
      case 'AddressDeet':
        deet = (
          <div className="deet-item" key={`my-deets-${item.id}`}>
            <AddressCard address={item as AddressDeet} />
          </div>
        );
        break;
      case 'EmailAddressDeet':
        deet = (
          <div className="deet-item" key={`my-deets-${item.id}`}>
            <EmailAddressCard email={item as EmailAddressDeet} />
          </div>
        );
        break;
      case 'PhoneNumberDeet':
        deet = (
          <div className="deet-item" key={`my-deets-${item.id}`}>
            <PhoneNumberCard phoneNumber={item as PhoneNumberDeet} />
          </div>
        );
    }
    columns[i % colCount].push(deet);
  }

  return (
    <div className="current-user-deets">
      {columns.map(col => (
        <div className="column">{col}</div>
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

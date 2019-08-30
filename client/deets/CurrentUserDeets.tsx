import * as React from 'react';
import { Deet } from 'client/types';
import { DeetCard } from './DeetCard';
import useWindowSize from 'client/hooks/useWindowSize';
import { isBrowser, splitColumns } from 'client/lib/dom';
import Loader from 'client/components/Loader';
import { useCurrentUserDeetsQuery } from 'generated/generated-types';

function CurrentUserDeets() {
  const { data: deets, loading: loadingDeets } = useCurrentUserDeetsQuery();

  const [colCount, setColCount] = React.useState<number>(3);

  if (isBrowser) {
    const size = useWindowSize();
    React.useEffect(() => {
      const cols = size && size.width ? Math.floor(size.width / 350) : 3;
      setColCount(cols || 1);
    }, [size.width]);
  }

  if (loadingDeets || !deets || !deets.userDeets) {
    return (
      <div className="current-user-deets">
        <Loader />
      </div>
    );
  }

  const sortedDeets = deets.userDeets.sort((a, b) => {
    if (a.isPrimary && b.isPrimary) {
      return 0;
    } else if (a.isPrimary) {
      return -1;
    } else if (b.isPrimary) {
      return 1;
    }

    return 0;
  });

  const deetCards = sortedDeets.map((item: Deet) => (
    <DeetCard key={`current-user-deet-${item.id}`} deet={item} isOwner />
  ));

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
          margin: 20px;
          display: flex;
        }
        .current-user-deets :global(.deet-item) {
          padding: 15px;
        }
      `}</style>
    </div>
  );
}

export default CurrentUserDeets;

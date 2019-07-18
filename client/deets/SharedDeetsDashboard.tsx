import * as React from 'react';
import { DeetTypes, Deet } from 'client/types';
import { DEET_TYPES } from './DeetCreator';
import { Dropdown, Button } from 'semantic-ui-react';
import Loader from 'client/components/Loader';
import { DeetCard } from './DeetCard';
import { isBrowser, splitColumns } from 'client/lib/dom';
import useWindowSize from 'client/hooks/useWindowSize';
import createUpdateQuery from 'client/lib/createUpdateQuery';
import { useAccessibleDeetsQuery } from 'generated/generated-types';

const PAGE_COUNT = 20;

const DEEP_TYPES_WITH_EMPTY = {
  all: {
    key: 'all',
    text: 'All Types',
    value: 'all',
  },
  ...DEET_TYPES,
};

function SharedDeetsDashboard() {
  const [filterType, setFilterType] = React.useState<DeetTypes | 'all'>('all');
  const [colCount, setColCount] = React.useState<number>(3);

  if (isBrowser) {
    const size = useWindowSize();
    React.useEffect(() => {
      const cols = size && size.width ? Math.floor(size.width / 350) : 3;
      setColCount(cols || 1);
    }, [size.width]);
  }

  const {
    data: deets,
    loading: loadingDeets,
    fetchMore: fetchMoreDeets,
  } = useAccessibleDeetsQuery({
    variables: {
      type: filterType === 'all' ? undefined : filterType,
      count: PAGE_COUNT,
      after: undefined,
    },
  });

  const changeType = (_: any, { value }: { value: DeetTypes }) => {
    setFilterType(value);
  };

  let content;
  if (loadingDeets || !deets || !deets.accessibleDeets) {
    content = <Loader />;
  } else {
    const deetCards = deets.accessibleDeets.items.map((deet: Deet) => (
      <DeetCard key={`shared-deet-${deet.id}`} deet={deet} isOwner={false} />
    ));
    const columns = splitColumns(deetCards, colCount);

    content = (
      <>
        <div className="shared-deets-list">{columns}</div>
        {deets.accessibleDeets.pageInfo.hasNext && (
          <Button
            onClick={() => {
              fetchMoreDeets({
                variables: {
                  after: deets.accessibleDeets.pageInfo.nextCursor,
                  count: PAGE_COUNT,
                  type: filterType === 'all' ? undefined : filterType,
                },
                updateQuery: createUpdateQuery('accessibleDeets'),
              });
            }}
          >
            Load more
          </Button>
        )}
      </>
    );
  }

  return (
    <div className="shared-deets-dashboard">
      <div className="controls">
        <Dropdown
          value={filterType}
          onChange={changeType}
          selection
          options={Object.values(DEEP_TYPES_WITH_EMPTY)}
        />
      </div>
      {content}
      <style jsx>{`
        .shared-deets-dashboard {
          padding: 30px;
        }
        .shared-deets-dashboard :global(.deet-item) {
          display: inline-block;
          padding: 15px;
        }
      `}</style>
    </div>
  );
}

export default SharedDeetsDashboard;

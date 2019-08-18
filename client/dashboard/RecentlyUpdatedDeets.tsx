import * as React from 'react';
import { Header, Button, Message } from 'semantic-ui-react';
import { useAccessibleDeetsQuery } from 'generated/generated-types';
import Loader from 'client/components/Loader';
import { splitColumns, isBrowser } from 'client/lib/dom';
import useWindowSize from 'client/hooks/useWindowSize';
import { DeetCard } from 'client/deets/DeetCard';
import createUpdateQuery from 'client/lib/createUpdateQuery';

const PAGE_COUNT = 5;

function RecentlyUpdatedDeets() {
  const { data: deets, loading, fetchMore } = useAccessibleDeetsQuery({
    variables: { count: PAGE_COUNT },
  });
  const [colCount, setColCount] = React.useState<number>(3);

  if (isBrowser) {
    const size = useWindowSize();
    React.useEffect(() => {
      const cols = size && size.width ? Math.floor(size.width / 350) : 3;
      setColCount(cols || 1);
    }, [size.width]);
  }

  console.log(deets.accessibleDeets);

  let content;
  if (loading) {
    content = <Loader />;
  } else if (
    deets &&
    deets.accessibleDeets &&
    deets.accessibleDeets.items.length
  ) {
    const deetCards = deets.accessibleDeets.items.map(deet => (
      <DeetCard key={`recent-deet-${deet.id}`} deet={deet} isOwner={false} />
    ));

    const columns = splitColumns(deetCards, colCount);

    content = (
      <>
        <div className="shared-deets-list">{columns}</div>
        {deets.accessibleDeets.pageInfo.hasNext && (
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  after: deets.accessibleDeets.pageInfo.nextCursor,
                  count: PAGE_COUNT,
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
  } else {
    content = (
      <Message info>No deets found. Get some deets from friends!</Message>
    );
  }

  return (
    <div className="recently-updated-deets-wrapper">
      <Header as="h2">Recently Updated Deets</Header>
      <div className="recently-updated-deets">{content}</div>
      <style jsx>{`
        .recently-updated-deets-wrapper {
          margin-top: 30px;
        }
        .recently-updated-deets {
          margin: 30px 0 0 10px;
        }
        .recently-updated-deets :global(.deet-item) {
          display: inline-block;
          padding: 15px;
        }
      `}</style>
    </div>
  );
}

export default RecentlyUpdatedDeets;

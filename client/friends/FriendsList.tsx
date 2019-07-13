import * as React from 'react';
import { User } from 'client/types';
import FriendItem from './FriendItem';
import { Button, Header } from 'semantic-ui-react';
import createUpdateQuery from 'client/lib/createUpdateQuery';
import { useQuery } from 'react-apollo-hooks';
import { FRIENDS_QUERY } from 'client/graph/queries';
import Loader from 'client/components/Loader';
import { splitColumns } from 'client/lib/dom';

const PAGE_COUNT = 20;

const FriendsList = ({ colCount }: { colCount: number }) => {
  const {
    data: friendsData,
    loading: friendsLoading,
    fetchMore: fetchMoreFriends,
  } = useQuery(FRIENDS_QUERY, {
    variables: { count: PAGE_COUNT, after: null },
  });

  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);

  let content;
  if (friendsLoading) {
    content = <Loader />;
  } else {
    const friendCards = friendsData.friends.items.map((friend: User) => (
      <div className="item" key={`friend-card-${friend.id}`}>
        <FriendItem key={`friend-${friend.id}`} friend={friend} />
      </div>
    ));

    content = splitColumns(friendCards, colCount);
  }

  return (
    <div className="friends-list">
      <Header as="h2">Friends</Header>
      {content}
      {loadingMore && <Loader />}
      {friendsData.friends &&
      friendsData.friends.items.length &&
      friendsData.friends.pageInfo.hasNext ? (
        <div className="load-more-wrapper">
          <Button
            disabled={friendsLoading}
            onClick={async () => {
              setLoadingMore(true);
              await fetchMoreFriends({
                variables: {
                  after: friendsData.friends.pageInfo.nextCursor,
                  count: PAGE_COUNT,
                },
                updateQuery: createUpdateQuery('friends'),
              });
              setLoadingMore(false);
            }}
          >
            Load more
          </Button>
        </div>
      ) : null}
      <style jsx>{`
        .friends-list {
          padding: 30px;
        }
        .friends-list :global(.item) {
          display: inline-block;
          margin: 15px;
        }
        .load-more-wrapper {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default FriendsList;

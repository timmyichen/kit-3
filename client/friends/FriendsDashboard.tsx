import * as React from 'react';
import {
  PENDING_FRIEND_REQUESTS_QUERY,
  FRIENDS_QUERY,
} from 'client/graph/queries';
import { useQuery } from 'react-apollo-hooks';
import PendingFriends from './PendingFriends';
import FriendsList from './FriendsList';
import createUpdateQuery from 'client/lib/createUpdateQuery';
import { Button } from 'semantic-ui-react';

const PAGE_COUNT = 20;

const FriendsDashboard = () => {
  const { data: pendingFriendsData, loading: pendingFriendsLoading } = useQuery(
    PENDING_FRIEND_REQUESTS_QUERY,
  );
  const {
    data: friendsData,
    loading: friendsLoading,
    fetchMore: fetchMoreFriends,
  } = useQuery(FRIENDS_QUERY, {
    variables: { count: PAGE_COUNT, after: null },
  });

  console.log(fetchMoreFriends);

  return (
    <div className="friends-page">
      {!pendingFriendsLoading && (
        <PendingFriends
          pendingFriends={pendingFriendsData.pendingFriendRequests || []}
        />
      )}
      {!friendsLoading && <FriendsList friends={friendsData.friends.items} />}
      {friendsData.friends &&
        friendsData.friends.items.length &&
        friendsData.friends.pageInfo.hasNext && (
          <Button
            disabled={friendsLoading}
            onClick={() =>
              fetchMoreFriends({
                variables: {
                  after: friendsData.friends.pageInfo.nextCursor,
                  count: PAGE_COUNT,
                },
                updateQuery: createUpdateQuery('friends'),
              })
            }
          >
            Load more
          </Button>
        )}
      <style jsx>{`
        .friends-page {
          padding-top: 30px;
        }
      `}</style>
    </div>
  );
};

export default FriendsDashboard;

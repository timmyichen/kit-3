import * as React from 'react';
import { User } from 'client/types';
import FriendItem from './FriendItem';
import { Button, Header } from 'semantic-ui-react';
import createUpdateQuery from 'client/lib/createUpdateQuery';
import { useQuery } from 'react-apollo-hooks';
import { FRIENDS_QUERY } from 'client/graph/queries';

const PAGE_COUNT = 20;

const FriendsList = () => {
  const {
    data: friendsData,
    loading: friendsLoading,
    fetchMore: fetchMoreFriends,
  } = useQuery(FRIENDS_QUERY, {
    variables: { count: PAGE_COUNT, after: null },
  });

  return (
    <div className="friends-list">
      <Header as="h2">Friends</Header>
      {friendsData.friends &&
        friendsData.friends.items.map((friend: User) => (
          <FriendItem key={`friend-${friend.id}`} friend={friend} />
        ))}
      {friendsData.friends &&
      friendsData.friends.items.length &&
      friendsData.friends.pageInfo.hasNext ? (
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
      ) : null}
      <style jsx>{`
        .friends-list {
          padding-top: 30px;
        }
      `}</style>
    </div>
  );
};

export default FriendsList;

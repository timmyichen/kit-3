import * as React from 'react';
import {
  PENDING_FRIEND_REQUESTS_QUERY,
  FRIENDS_QUERY,
} from 'client/graph/queries';
import { useQuery } from 'react-apollo-hooks';
import PendingFriends from './PendingFriends';
import FriendsList from './FriendsList';

const FriendsDashboard = () => {
  const { data: pendingFriendsData, loading: pendingFriendsLoading } = useQuery(
    PENDING_FRIEND_REQUESTS_QUERY,
  );
  const { data: friendsData, loading: friendsLoading } = useQuery(
    FRIENDS_QUERY,
  );

  return (
    <div className="friends-page">
      {!pendingFriendsLoading && (
        <PendingFriends
          pendingFriends={pendingFriendsData.pendingFriendRequests || []}
        />
      )}
      {!friendsLoading && <FriendsList friends={friendsData.friends.items} />}
      <style jsx>{`
        .friends-page {
          padding-top: 30px;
        }
      `}</style>
    </div>
  );
};

export default FriendsDashboard;

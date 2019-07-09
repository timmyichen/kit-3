import * as React from 'react';
import { PENDING_FRIEND_REQUESTS_QUERY } from 'client/graph/queries';
import { useQuery } from 'react-apollo-hooks';
import PendingFriends from './PendingFriends';
import FriendsList from './FriendsList';

const FriendsDashboard = () => {
  const { data: pendingFriendsData, loading: pendingFriendsLoading } = useQuery(
    PENDING_FRIEND_REQUESTS_QUERY,
  );

  return (
    <div className="friends-page">
      {!pendingFriendsLoading && (
        <PendingFriends
          pendingFriends={pendingFriendsData.pendingFriendRequests || []}
        />
      )}
      <FriendsList />
      <style jsx>{`
        .friends-page {
          padding-top: 30px;
        }
      `}</style>
    </div>
  );
};

export default FriendsDashboard;

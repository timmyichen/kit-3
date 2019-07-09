import * as React from 'react';
import PendingFriends from './PendingFriends';
import FriendsList from './FriendsList';

const FriendsDashboard = () => {
  return (
    <div className="friends-page">
      <PendingFriends />
      <FriendsList />
      <style jsx>{`
        .friends-page {
        }
      `}</style>
    </div>
  );
};

export default FriendsDashboard;

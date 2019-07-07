import * as React from 'react';
import { User } from 'client/types';
import FriendItem from './FriendItem';

interface Props {
  friends: Array<User>;
}

const FriendsList = ({ friends }: Props) => {
  return (
    <div className="friends-list">
      {friends.map((friend: User) => (
        <FriendItem friend={friend} />
      ))}
      <style jsx>{`
        .friends-list {
          padding-top: 30px;
        }
      `}</style>
    </div>
  );
};

export default FriendsList;

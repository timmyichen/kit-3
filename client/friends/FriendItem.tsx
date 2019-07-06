import * as React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { User } from 'client/types';

interface Props {
  friend: User;
}

const FriendItem = ({ friend }: Props) => {
  return (
    <div className="friend-list-item">
      <Card key={`friend-list-${friend.username}`}>
        <Card.Content>
          <Image floated="right" size="mini" />
          <Card.Header>{friend.fullName}</Card.Header>
          <Card.Meta>{friend.username}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <div className="ctas"></div>
        </Card.Content>
      </Card>
      <style jsx>{`
        .friend-list-item {
        }
      `}</style>
    </div>
  );
};

export default FriendItem;

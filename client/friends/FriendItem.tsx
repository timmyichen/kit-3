import * as React from 'react';
import { Card, Image, Dropdown } from 'semantic-ui-react';
import { User } from 'client/types';
import BlockUserModal from 'client/components/BlockUserModal';
import RemoveFriendModal from 'client/components/RemoveFriendModal';

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
          <div className="ctas">
            <Dropdown
              text="Actions"
              icon="unordered list"
              floating
              labeled
              button
              className="icon"
            >
              <Dropdown.Menu>
                <RemoveFriendModal user={friend}>
                  <Dropdown.Item text="Remove Friend" icon="user x" />
                </RemoveFriendModal>
                <BlockUserModal user={friend}>
                  <Dropdown.Item text="Block" icon="ban" />
                </BlockUserModal>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Content>
      </Card>
      <style jsx>{`
        .ctas {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
};

export default FriendItem;

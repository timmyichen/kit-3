import * as React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { User } from 'client/types';
import { useMutation } from 'react-apollo-hooks';
import { ACCEPT_REQUEST_MUTATION } from 'client/graph/mutations';
import BlockUserModal from 'client/components/BlockUserModal';

interface Props {
  pendingFriends: Array<User>;
}

const PendingFriends = (props: Props) => {
  const acceptFriendRequest = useMutation(ACCEPT_REQUEST_MUTATION);

  return (
    <div className="friends-page">
      {props.pendingFriends.map((user: User) => (
        <Card key={`pending-friend-${user.username}`}>
          <Card.Content>
            <Image floated="right" size="mini" />
            <Card.Header>{user.fullName}</Card.Header>
            <Card.Meta>{user.username}</Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <div className="ctas">
              <Button
                basic
                color="green"
                onClick={() =>
                  acceptFriendRequest({ variables: { targetUserId: user.id } })
                }
              >
                Accept Request
              </Button>
              <BlockUserModal user={user}>
                <Button basic color="black">
                  Block
                </Button>
              </BlockUserModal>
            </div>
          </Card.Content>
        </Card>
      ))}
      <style jsx>{`
        .friends-page {
          padding-top: 30px;
        }
        .ctas {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
};

export default PendingFriends;

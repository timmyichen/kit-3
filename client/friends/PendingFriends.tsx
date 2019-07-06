import * as React from 'react';
import { Card, Image, Button, Modal, Header } from 'semantic-ui-react';
import { User } from 'client/types';
import { useMutation } from 'react-apollo-hooks';
import {
  ACCEPT_REQUEST_MUTATION,
  BLOCK_USER_MUTATION,
} from 'client/graph/mutations';

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
              <BlockModal user={user} />
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

interface BlockModalProps {
  user: User;
}

function BlockModal({ user }: BlockModalProps) {
  const blockUser = useMutation(BLOCK_USER_MUTATION);
  const [show, setShow] = React.useState<boolean>(false);

  const closeModal = () => setShow(false);
  const showModal = () => setShow(true);

  return (
    <Modal
      trigger={
        <Button basic color="black" onClick={showModal}>
          Block
        </Button>
      }
      open={show}
      onClose={closeModal}
      size="tiny"
    >
      <Header icon="ban" content="Block User" />
      <Modal.Content>
        <h3>Are you sure you want to block {user.fullName}?</h3>
      </Modal.Content>
      <Modal.Actions>
        <div className="ctas">
          <Button onClick={closeModal}>Cancel</Button>
          <Button
            color="red"
            onClick={() => blockUser({ variables: { targetUserId: user.id } })}
          >
            Block
          </Button>
        </div>
      </Modal.Actions>
      <style jsx>{`
        .ctas {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </Modal>
  );
}

export default PendingFriends;

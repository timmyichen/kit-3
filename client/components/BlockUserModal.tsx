import * as React from 'react';
import { User } from 'client/types';
import { useMutation } from 'react-apollo-hooks';
import { BLOCK_USER_MUTATION } from 'client/graph/mutations';
import { Modal, Button, Header } from 'semantic-ui-react';

interface BlockModalProps {
  user: User;
  children: React.ReactElement<any>;
}

export default function BlockUserModal({ user, children }: BlockModalProps) {
  const blockUser = useMutation(BLOCK_USER_MUTATION);
  const [show, setShow] = React.useState<boolean>(false);

  const closeModal = () => setShow(false);
  const showModal = () => setShow(true);

  const trigger = React.cloneElement(children, { onClick: showModal });

  return (
    <Modal trigger={trigger} open={show} onClose={closeModal} size="tiny">
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

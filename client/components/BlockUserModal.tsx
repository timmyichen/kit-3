import * as React from 'react';
import { User } from 'client/types';
import { useMutation } from 'react-apollo-hooks';
import { BLOCK_USER_MUTATION } from 'client/graph/mutations';
import { Modal, Button, Header } from 'semantic-ui-react';
import CtxModal, { closeModal } from './Modal';
import { useCtxDispatch } from './ContextProvider';
import { DataProxy } from 'apollo-cache';
import { FetchResult } from 'react-apollo';

interface BlockModalProps {
  user: User;
  update?: ((cache: DataProxy, data: FetchResult<any>) => void) | undefined;
}

export default function BlockUserModal({ user, update }: BlockModalProps) {
  const blockUser = useMutation(BLOCK_USER_MUTATION, { update });
  const [blocking, setBlocking] = React.useState<boolean>(false);
  const dispatch = useCtxDispatch();

  const onBlockUser = async () => {
    setBlocking(true);
    try {
      await blockUser({ variables: { targetUserId: user.id } });
    } catch (e) {
      setBlocking(false);
      throw e;
    }
    closeModal(dispatch);
  };

  return (
    <CtxModal size="tiny">
      <Header icon="ban" content="Block User" />
      <Modal.Content>
        <h3>Are you sure you want to block {user.fullName}?</h3>
      </Modal.Content>
      <Modal.Actions>
        <div className="ctas">
          <Button onClick={() => closeModal(dispatch)}>Cancel</Button>
          <Button disabled={blocking} color="red" onClick={onBlockUser}>
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
        @media only screen and (max-width: 767px) {
          .ctas {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </CtxModal>
  );
}

import * as React from 'react';
import { User } from 'client/types';
import { Modal, Button, Header } from 'semantic-ui-react';
import CtxModal, { closeModal } from './Modal';
import { useCtxDispatch } from './ContextProvider';
import { DataProxy } from 'apollo-cache';
import { FetchResult } from 'react-apollo';
import { useRemoveFriendMutation } from 'generated/generated-types';

interface RemoveModalProps {
  user: User;
  update?: ((cache: DataProxy, data: FetchResult<any>) => void) | undefined;
}

export default function RemoveFriendModal({ user, update }: RemoveModalProps) {
  const removeFriend = useRemoveFriendMutation({ update });
  const [removing, setRemoving] = React.useState<boolean>(false);
  const dispatch = useCtxDispatch();

  const onRemoveFriend = async () => {
    setRemoving(true);
    try {
      await removeFriend({ variables: { targetUserId: user.id } });
    } catch (e) {
      setRemoving(false);
      throw e;
    }
    closeModal(dispatch);
  };

  return (
    <CtxModal size="tiny">
      <Header icon="user x" content="Remove Friend" />
      <Modal.Content>
        <h3>Are you sure you want to unfriend {user.fullName}?</h3>
      </Modal.Content>
      <Modal.Actions>
        <div className="ctas">
          <Button onClick={() => closeModal(dispatch)}>Cancel</Button>
          <Button disabled={removing} color="red" onClick={onRemoveFriend}>
            Remove Friend
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

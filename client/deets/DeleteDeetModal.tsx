import * as React from 'react';
import { Deet } from 'client/types';
import { Modal, Button, Header } from 'semantic-ui-react';
import { useCtxDispatch } from 'client/components/ContextProvider';
import CtxModal, { closeModal } from 'client/components/Modal';
import postMutationUpdateCache from 'client/lib/postMutationUpdateCache';
import {
  useDeleteDeetMutation,
  CurrentUserDeetsDocument,
} from 'generated/generated-types';
import useMessages from 'client/hooks/useMessages';

interface Props {
  deet: Deet;
}

export default function DeleteDeetModal({ deet }: Props) {
  const { showError, showConfirm } = useMessages({ length: 4000 });

  const deleteDeet = useDeleteDeetMutation({
    update: (cache, { data }) => {
      postMutationUpdateCache<{ userDeets: Array<Deet> }, Deet>({
        cache,
        query: { query: CurrentUserDeetsDocument },
        fieldName: 'userDeets',
        type: 'remove',
        targetObj: data!.deleteDeet,
      });
    },
  });
  const [deleting, setDeleting] = React.useState<boolean>(false);
  const dispatch = useCtxDispatch();

  const onDeleteDeet = async () => {
    setDeleting(true);
    try {
      await deleteDeet({ variables: { deetId: deet.id } });
    } catch (e) {
      setDeleting(false);
      return showError(e.message);
    }
    showConfirm('Deet deleted');
    closeModal(dispatch);
  };

  return (
    <CtxModal size="tiny">
      <Header icon="trash alternate" content="Delete Deet" />
      <Modal.Content>
        <h3>Are you sure you want to delete {deet.label}?</h3>
        <p>Friends will no longer be able to see this deet.</p>
      </Modal.Content>
      <Modal.Actions>
        <div className="ctas">
          <Button onClick={() => closeModal(dispatch)}>Cancel</Button>
          <Button disabled={deleting} color="red" onClick={onDeleteDeet}>
            Delete
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

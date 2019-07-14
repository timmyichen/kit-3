import * as React from 'react';
import { Deet } from 'client/types';
import { useMutation } from 'react-apollo-hooks';
import { DELETE_DEET_MUTATION } from 'client/graph/mutations';
import { Modal, Button, Header } from 'semantic-ui-react';
import { useCtxDispatch } from 'client/components/ContextProvider';
import CtxModal, { closeModal } from 'client/components/Modal';
import { CURRENT_USER_DEETS_QUERY } from 'client/graph/queries';
import postMutationUpdateCache from 'client/lib/postMutationUpdateCache';

interface Props {
  deet: Deet;
}

export default function DeleteDeetModal({ deet }: Props) {
  const deleteDeet = useMutation(DELETE_DEET_MUTATION, {
    update: (cache, { data }: { data: { deleteDeet: Deet } }) => {
      postMutationUpdateCache<{ userDeets: Array<Deet> }, Deet>({
        cache,
        query: { query: CURRENT_USER_DEETS_QUERY },
        fieldName: 'userDeets',
        isPaginated: false,
        type: 'remove',
        targetObj: data.deleteDeet,
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
      throw e;
    }
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

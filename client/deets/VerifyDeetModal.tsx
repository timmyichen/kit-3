import * as React from 'react';
import { useVerifyDeetMutation } from 'generated/generated-types';
import { Deet } from 'client/types';
import CtxModal, { closeModal } from 'client/components/Modal';
import { Modal, Header, Button } from 'semantic-ui-react';
import { useCtxDispatch } from 'client/components/ContextProvider';
import useMessages from 'client/hooks/useMessages';

export default function VerifyDeetModal({ deet }: { deet: Deet }) {
  const { showError, showConfirm } = useMessages({ length: 4000 });
  const verifyDeet = useVerifyDeetMutation({ variables: { deetId: deet.id } });
  const [verifying, setVerifying] = React.useState<boolean>(false);

  const dispatch = useCtxDispatch();

  const onVerifyDeet = async () => {
    setVerifying(true);
    try {
      await verifyDeet();
    } catch (e) {
      setVerifying(false);
      return showError(e.message);
    }
    showConfirm('Deet verified');
    closeModal(dispatch);
  };

  return (
    <CtxModal size="tiny">
      <Header icon="check circle outline" content="Verify Deet" />
      <Modal.Content>
        <p>
          Friends will know that this deet has been verified and is accurate.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <div className="ctas">
          <Button onClick={() => closeModal(dispatch)}>Cancel</Button>
          <Button disabled={verifying} color="green" onClick={onVerifyDeet}>
            Verify
          </Button>
        </div>
      </Modal.Actions>
    </CtxModal>
  );
}

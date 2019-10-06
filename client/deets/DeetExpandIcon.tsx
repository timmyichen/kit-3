import { Deet } from 'client/types';
import { useCtxDispatch } from 'client/components/ContextProvider';
import CtxModal from 'client/components/Modal';
import { Icon, Header, Modal } from 'semantic-ui-react';
import {
  DeetDescription,
  DeetType,
  DeetFooter,
  DeetIcon,
} from './DeetComponents';

interface Props {
  deet: Deet;
  isOwner: boolean;
}

const DeetExpandIcon = ({ deet, isOwner }: Props) => {
  const dispatch = useCtxDispatch();

  const onClick = () => {
    dispatch({
      type: 'SET_MODAL',
      modal: (
        <CtxModal
          size="tiny"
          style={{ maxWidth: '400px' }}
          className="deet-modal"
        >
          <div className="header">
            <Header as="h2">{deet.label}</Header>
            <DeetType deet={deet} isOwner={isOwner} />
          </div>
          <Modal.Content style={{ position: 'relative' }}>
            <DeetIcon deet={deet} />
            <DeetDescription deet={deet} />
          </Modal.Content>
          <div className="footer">
            <DeetFooter deet={deet} isOwner={isOwner} />
          </div>
          <style jsx>{`
            .header {
              border-bottom: 1px solid rgba(34, 36, 38, 0.15);
            }
            .footer {
              padding: 21px;
              border-top: 1px solid rgba(34, 36, 38, 0.15);
            }
            :global(.deet-modal a) {
              color: inherit !important;
            }
            :global(.deet-modal .deet-icon) {
              position: absolute;
              top: 5px;
              right: 0px;
            }
          `}</style>
        </CtxModal>
      ),
    });
  };

  return (
    <Icon
      size="small"
      className="expand-icon"
      floated="right"
      name="expand arrows alternate"
      onClick={onClick}
    />
  );
};

export default DeetExpandIcon;

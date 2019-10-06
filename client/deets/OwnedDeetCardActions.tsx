import * as React from 'react';
import { Deet } from 'client/types';
import { Dropdown } from 'semantic-ui-react';
import DeetSharingModal from './DeetSharingModal';
import { useCtxDispatch } from 'client/components/ContextProvider';
import DeleteDeetModal from './DeleteDeetModal';
import { EditDeetModal } from './EditDeetModal';
import VerifyDeetModal from './VerifyDeetModal';

interface Props {
  deet: Deet;
}

export function OwnedDeetCardActions({ deet }: Props) {
  const dispatch = useCtxDispatch();

  const showModal = (modal: React.ReactNode) => {
    dispatch({
      type: 'SET_MODAL',
      modal,
    });
  };

  return (
    <div className="owned-deet-actions">
      <Dropdown
        text="Actions"
        icon="unordered list"
        floating
        labeled
        button
        className="icon"
      >
        <Dropdown.Menu>
          <Dropdown.Item
            text="Verify"
            icon="check circle outline"
            onClick={() => showModal(<VerifyDeetModal deet={deet} />)}
          />
          <Dropdown.Item
            text="Edit"
            icon="pencil alternate"
            onClick={() => showModal(<EditDeetModal deet={deet} />)}
          />
          <Dropdown.Item
            text="Share"
            icon="users"
            onClick={() => showModal(<DeetSharingModal deet={deet} />)}
          />
          <Dropdown.Item
            text="Delete"
            icon="trash alternate"
            onClick={() => showModal(<DeleteDeetModal deet={deet} />)}
          />
        </Dropdown.Menu>
      </Dropdown>
      <style jsx>{`
        .owned-deet-actions :global(.deet-card-content) {
          position: relative;
        }
      `}</style>
    </div>
  );
}

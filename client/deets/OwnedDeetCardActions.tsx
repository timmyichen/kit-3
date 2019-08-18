import * as React from 'react';
import { Deet } from 'client/types';
import { Dropdown } from 'semantic-ui-react';
import DeetSharingModal from './DeetSharingModal';
import { useCtxDispatch } from 'client/components/ContextProvider';
import DeleteDeetModal from './DeleteDeetModal';
import { EditDeetModal } from './EditDeetModal';

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
    <div className="address-card-wrapper">
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
        .address-card-wrapper :global(.deet-card-content) {
          position: relative;
        }
        .address-card-wrapper :global(.header-icon) {
          position: absolute;
          top: 5px;
          right: 5px;
        }
      `}</style>
    </div>
  );
}

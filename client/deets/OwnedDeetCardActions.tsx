import * as React from 'react';
import { Deet } from 'client/types';
import { Dropdown } from 'semantic-ui-react';
import DeetSharingModal from './DeetSharingModal';
import { useCtxDispatch } from 'client/components/ContextProvider';

interface Props {
  deet: Deet;
}

export function OwnedDeetCardActions({ deet }: Props) {
  const dispatch = useCtxDispatch();

  const showDeetSharingModal = () => {
    dispatch({
      type: 'SET_MODAL',
      modal: <DeetSharingModal deet={deet} />,
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
            text="Share"
            icon="users"
            onClick={showDeetSharingModal}
          />
        </Dropdown.Menu>
      </Dropdown>
      <style jsx>{`
        .address-card-wrapper :global(.address-card-content) {
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

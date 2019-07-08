import * as React from 'react';
import { Deet } from 'client/types';
import { Dropdown } from 'semantic-ui-react';
import DeetSharingModal from './DeetSharingModal';

interface Props {
  deet: Deet;
}

export function OwnedDeetCardActions({ deet }: Props) {
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
          <DeetSharingModal deet={deet}>
            <Dropdown.Item text="Share" icon="users" />
          </DeetSharingModal>
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

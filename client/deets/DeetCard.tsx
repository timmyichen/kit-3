import * as React from 'react';
import { Card } from 'semantic-ui-react';
import {
  DeetCardType,
  DeetCardIcon,
  DeetCardDescription,
  DeetCardFooter,
} from './DeetComponents';
import { Deet } from 'client/types';

interface Props {
  deet: Deet;
  isOwner: boolean;
}

export function DeetCard({ deet, isOwner }: Props) {
  return (
    <div className="deet-item">
      <Card>
        <Card.Content className="address-card-content">
          <DeetCardIcon deet={deet} />
          <Card.Header>{deet.label}</Card.Header>
          <DeetCardType deet={deet} isOwner={isOwner} />
          <DeetCardDescription deet={deet} />
        </Card.Content>
        <DeetCardFooter deet={deet} isOwner={isOwner} />
      </Card>
      <style jsx>{`
        .deet-item {
          position: relative;
        }
        .deet-item :global(.header-icon) {
          position: absolute;
          top: 5px;
          right: 5px;
        }
      `}</style>
    </div>
  );
}

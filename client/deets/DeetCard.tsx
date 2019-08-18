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
  let color: 'green' | 'orange' | 'blue';

  switch (deet.type) {
    case 'address':
      color = 'green';
      break;
    case 'email_address':
      color = 'orange';
      break;
    case 'phone_number':
      color = 'blue';
      break;
    default:
      throw new Error(`${deet.type} not recognized`);
  }
  return (
    <div className="deet-item">
      <Card className="deet-card-content" color={color}>
        <Card.Content>
          <DeetCardIcon deet={deet} />
          <Card.Header>{deet.label}</Card.Header>
          <DeetCardType deet={deet} isOwner={isOwner} />
        </Card.Content>
        <Card.Content>
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
          right: 0px;
        }
      `}</style>
    </div>
  );
}

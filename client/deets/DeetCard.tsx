import * as React from 'react';
import { Card } from 'semantic-ui-react';
import {
  DeetType,
  DeetIcon,
  DeetDescription,
  DeetFooter,
} from './DeetComponents';
import { Deet } from 'client/types';
import DeetExpandIcon from './DeetExpandIcon';

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
        <DeetExpandIcon deet={deet} isOwner={isOwner} />
        <Card.Content>
          <Card.Header>{deet.label}</Card.Header>
          <Card.Meta>
            <DeetType deet={deet} isOwner={isOwner} />
          </Card.Meta>
        </Card.Content>
        <Card.Content style={{ position: 'relative' }}>
          <DeetIcon deet={deet} />
          <Card.Description>
            <DeetDescription deet={deet} />
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <DeetFooter deet={deet} isOwner={isOwner} />
        </Card.Content>
      </Card>
      <style jsx>{`
        .deet-item {
          position: relative;
        }
        .deet-item :global(.expand-icon) {
          position: absolute;
          top: 10px;
          right: 5px;
          cursor: pointer;
        }
        .deet-item :global(.deet-icon) {
          position: absolute;
          top: 5px;
          right: 0px;
        }
      `}</style>
    </div>
  );
}

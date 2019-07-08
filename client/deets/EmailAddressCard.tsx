import * as React from 'react';
import { EmailAddressDeet } from 'client/types';
import { Card, Icon } from 'semantic-ui-react';
import { OwnedDeetCardActions } from './OwnedDeetCardActions';

interface Props {
  email: EmailAddressDeet;
}

export function EmailAddressCard({ email }: Props) {
  return (
    <div className="email-card-wrapper">
      <Card>
        <Card.Content className="email-card-content">
          <Icon
            size="large"
            className="header-icon"
            floated="right"
            name="desktop"
          />
          <Card.Header>{email.label}</Card.Header>
          <Card.Meta>Email</Card.Meta>
          <Card.Description>
            <div>{email.emailAddress}</div>
            <div>{email.notes}</div>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <OwnedDeetCardActions deet={email} />
        </Card.Content>
      </Card>
      <style jsx>{`
        .email-card-wrapper :global(.email-card-content) {
          position: relative;
        }
        .email-card-wrapper :global(.header-icon) {
          position: absolute;
          top: 5px;
          right: 5px;
        }
      `}</style>
    </div>
  );
}

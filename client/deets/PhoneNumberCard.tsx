import * as React from 'react';
import { PhoneNumberDeet } from 'client/types';
import { Card, Icon } from 'semantic-ui-react';
import { OwnedDeetCardActions } from './OwnedDeetCardActions';

interface Props {
  phoneNumber: PhoneNumberDeet;
}

export function PhoneNumberCard({ phoneNumber }: Props) {
  return (
    <div className="phoneNumber-card-wrapper">
      <Card>
        <Card.Content className="phoneNumber-card-content">
          <Icon
            size="large"
            className="header-icon"
            floated="right"
            name="mobile alternate"
          />
          <Card.Header>{phoneNumber.label}</Card.Header>
          <Card.Meta>Phone Number</Card.Meta>
          <Card.Description>
            <div>
              {phoneNumber.countryCode && `+${phoneNumber.countryCode} `}
              {phoneNumber.number}
            </div>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <OwnedDeetCardActions deet={phoneNumber} />
        </Card.Content>
      </Card>
      <style jsx>{`
        .phoneNumber-card-wrapper :global(.phoneNumber-card-content) {
          position: relative;
        }
        .phoneNumber-card-wrapper :global(.header-icon) {
          position: absolute;
          top: 5px;
          right: 5px;
        }
      `}</style>
    </div>
  );
}

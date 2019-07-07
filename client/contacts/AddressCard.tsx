import * as React from 'react';
import { AddressDeet } from 'client/types';
import { Card, Icon } from 'semantic-ui-react';

interface Props {
  address: AddressDeet;
}

export function AddressCard({ address }: Props) {
  return (
    <div className="address-card-wrapper">
      <Card>
        <Card.Content className="address-card-content">
          <Icon
            size="large"
            className="header-icon"
            floated="right"
            name="envelope outline"
          />
          <Card.Header>{address.label}</Card.Header>
          <Card.Meta>Mailing Address</Card.Meta>
          <Card.Description>
            <div>{address.addressLine1}</div>
            <div>{address.addressLine2}</div>
            <div>{address.city}</div>
            <div>{address.state}</div>
            <div>{address.postalCode}</div>
            <div>{address.country}</div>
            <div>{address.notes}</div>
          </Card.Description>
        </Card.Content>
      </Card>
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

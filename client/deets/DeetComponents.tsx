import { Icon, Card } from 'semantic-ui-react';
import {
  Deet,
  AddressDeet,
  EmailAddressDeet,
  PhoneNumberDeet,
} from 'client/types';
import { OwnedDeetCardActions } from './OwnedDeetCardActions';

const deetMap = {
  email_address: {
    icon: 'desktop',
    text: 'Email Address',
  },
  address: {
    icon: 'mail square',
    text: 'Mailing Address',
  },
  phone_number: {
    icon: 'mobile alternate',
    text: 'Phone Number',
  },
};

export const DeetCardIcon = ({ deet }: { deet: Deet }) => (
  <Icon
    size="large"
    className="header-icon"
    floated="right"
    name={deetMap[deet.type].icon as any}
  />
);

export const DeetCardType = ({
  deet,
  isOwner,
}: {
  deet: Deet;
  isOwner: boolean;
}) =>
  isOwner ? (
    <Card.Meta>{deetMap[deet.type].text}</Card.Meta>
  ) : (
    <Card.Meta>
      <span title={deet.owner.username}>{deet.owner.fullName}</span>'s{' '}
      {deetMap[deet.type].text}
    </Card.Meta>
  );

export const DeetCardDescription = ({ deet }: { deet: Deet }) => {
  switch (deet.type) {
    case 'address':
      const address: AddressDeet = deet as AddressDeet;
      return (
        <Card.Description>
          <div>{address.addressLine1}</div>
          <div>{address.addressLine2}</div>
          <div>{address.city}</div>
          <div>{address.state}</div>
          <div>{address.postalCode}</div>
          <div>{address.country}</div>
          <div>{address.notes}</div>
        </Card.Description>
      );
    case 'phone_number':
      const phoneNumber: PhoneNumberDeet = deet as PhoneNumberDeet;
      return (
        <div>
          {phoneNumber.countryCode && `+${phoneNumber.countryCode} `}
          {phoneNumber.number}
        </div>
      );
    case 'email_address':
      const email: EmailAddressDeet = deet as EmailAddressDeet;
      return (
        <Card.Description>
          <div>{email.emailAddress}</div>
          <div>{email.notes}</div>
        </Card.Description>
      );
    default:
      return null;
  }
};

export const DeetCardFooter = ({
  deet,
  isOwner,
}: {
  deet: Deet;
  isOwner: boolean;
}) => (
  <Card.Content extra>
    {isOwner ? (
      <OwnedDeetCardActions deet={deet} />
    ) : (
      <div>
        Last updated {new Date(parseInt(deet.updatedAt, 10)).toISOString()}
      </div>
    )}
  </Card.Content>
);

import { Icon, Card } from 'semantic-ui-react';
import {
  Deet,
  AddressDeet,
  EmailAddressDeet,
  PhoneNumberDeet,
} from 'client/types';
import ta from 'time-ago';
import { OwnedDeetCardActions } from './OwnedDeetCardActions';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
}) => {
  const router = useRouter();

  const includeLink = !isOwner && router.pathname !== '/friend';

  if (!isOwner && !deet.owner) {
    throw new Error('Expected owner for non-owned deets');
  }

  const text = (deet.isPrimary ? 'Primary ' : '') + deetMap[deet.type].text;

  return isOwner ? (
    <Card.Meta>{text}</Card.Meta>
  ) : (
    <Card.Meta>
      {includeLink ? (
        <Link
          href={{
            pathname: '/friend',
            query: { username: deet.owner!.username },
          }}
          as={`/friend/${deet.owner!.username}`}
        >
          <a title={deet.owner!.username}>{deet.owner!.fullName}</a>
        </Link>
      ) : (
        <span title={deet.owner!.username}>{deet.owner!.fullName}</span>
      )}
      's {text}
      <style jsx>{`
        a {
          text-decoration: underline;
        }
      `}</style>
    </Card.Meta>
  );
};

export const DeetCardDescription = ({ deet }: { deet: Deet }) => {
  switch (deet.type) {
    case 'address':
      const address = deet as AddressDeet;
      return (
        <Card.Description>
          <div>{address.addressLine1}</div>
          {address.addressLine2 && <div>{address.addressLine2}</div>}
          <div>
            {address.city}, {address.state} {address.postalCode}
          </div>
          {address.country && <div>{address.country}</div>}
          <Notes notes={address.notes} />
        </Card.Description>
      );
    case 'phone_number':
      const phoneNumber = deet as PhoneNumberDeet;
      return (
        <div>
          <div>
            {phoneNumber.countryCode && `+${phoneNumber.countryCode} `}
            {phoneNumber.phoneNumber}
          </div>
          <Notes notes={phoneNumber.notes} />
        </div>
      );
    case 'email_address':
      const email = deet as EmailAddressDeet;
      return (
        <Card.Description>
          <div>{email.emailAddress}</div>
          <Notes notes={email.notes} />
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
    <div className="extra-wrapper">
      <div>
        <div className="last-updated-label">Last verified</div>
        <div className="last-updated">
          {ta.ago(parseInt(deet.verifiedAt, 10))}
        </div>
      </div>
      <div className="actions-wrapper">
        {isOwner && <OwnedDeetCardActions deet={deet} />}
      </div>
    </div>
    <style jsx>{`
      .extra-wrapper {
        display: flex;
        align-items: center;
        justify-content: ${isOwner ? 'space-between' : 'start'};
      }
      .last-updated-label {
        font-size: 12px;
      }
      .last-updated {
        color: rgba(0, 0, 0, 0.68);
      }
    `}</style>
  </Card.Content>
);

const Notes = ({ notes }: { notes?: string }) => {
  if (!notes) {
    return null;
  }

  return (
    <div>
      <h4 className="notes-label">Notes</h4>
      <pre>{notes.trim()}</pre>
      <style jsx>{`
        .notes-label {
          margin: 10px 0 0;
        }
        pre {
          font-family: inherit;
          margin: 5px 0 5px;
        }
      `}</style>
    </div>
  );
};

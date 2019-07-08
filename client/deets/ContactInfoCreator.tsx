import * as React from 'react';
import { Button, Icon, Dropdown } from 'semantic-ui-react';
import { DeetTypes } from 'client/types';
import AddressCreator from './CreateAddress';
import PhoneNumberCreator from './CreatePhoneNumber';
import EmailAddressCreator from './CreateEmailAddress';
import {
  UPSERT_ADDRESS_MUTATION,
  UPSERT_PHONE_NUMBER_MUTATION,
  UPSERT_EMAIL_ADDRESS_MUTATION,
} from 'client/graph/mutations';
import { useMutation } from 'react-apollo-hooks';

const DEET_TYPES = [
  {
    key: 'address',
    text: 'Address',
    value: 'address',
  },
  {
    key: 'phone_number',
    text: 'Phone Number',
    value: 'phone_number',
  },
  {
    key: 'email_address',
    text: 'Email Address',
    value: 'email_address',
  },
];

export default function ContactInfoCreator() {
  const [showCreation, setShowCreation] = React.useState<boolean>(false);
  const [creatingType, setCreatingType] = React.useState<DeetTypes>('address');
  const [loading, setLoading] = React.useState<boolean>(false);

  const toggleCreationForm = () => setShowCreation(!showCreation);
  const changeType = (_: any, { value }: { value: DeetTypes }) => {
    setCreatingType(value);
  };

  const upsertAddress = useMutation(UPSERT_ADDRESS_MUTATION);
  const upsertPhoneNumber = useMutation(UPSERT_PHONE_NUMBER_MUTATION);
  const upsertEmailAddress = useMutation(UPSERT_EMAIL_ADDRESS_MUTATION);

  const submitForm = async (variables: Object) => {
    let mutation;
    switch (creatingType) {
      case 'address':
        mutation = upsertAddress;
        break;
      case 'phone_number':
        mutation = upsertPhoneNumber;
        break;
      case 'email_address':
        mutation = upsertEmailAddress;
        break;
      default:
        throw new Error(`Unrecognized type ${creatingType}`);
    }

    setLoading(true);
    try {
      console.log(variables);
      await mutation({ variables });
    } catch (e) {
      setLoading(false);
      throw e;
    }

    setLoading(false);
  };

  return (
    <div className="contact-info-creator">
      <div className="controls">
        <Button
          disabled={loading}
          positive
          icon
          labelPosition="left"
          onClick={toggleCreationForm}
        >
          <Icon name={showCreation ? 'minus' : 'plus'} />
          {showCreation ? 'Cancel' : 'Create'}
        </Button>
      </div>
      {showCreation && (
        <div className="creation-form-wrapper">
          <Dropdown
            value={creatingType}
            onChange={changeType}
            selection
            options={DEET_TYPES}
          />
          {creatingType === 'address' && (
            <AddressCreator onSubmit={submitForm} loading={loading} />
          )}
          {creatingType === 'phone_number' && (
            <PhoneNumberCreator onSubmit={submitForm} loading={loading} />
          )}
          {creatingType === 'email_address' && (
            <EmailAddressCreator onSubmit={submitForm} loading={loading} />
          )}
        </div>
      )}
      <style jsx>{`
        .contact-info-creator {
        }
      `}</style>
    </div>
  );
}

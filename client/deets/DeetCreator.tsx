import * as React from 'react';
import { Button, Icon, Dropdown, Header, Modal } from 'semantic-ui-react';
import { DeetTypes, Deet } from 'client/types';
import AddressCreator from './CreateAddress';
import PhoneNumberCreator from './CreatePhoneNumber';
import EmailAddressCreator from './CreateEmailAddress';
import {
  UPSERT_ADDRESS_MUTATION,
  UPSERT_PHONE_NUMBER_MUTATION,
  UPSERT_EMAIL_ADDRESS_MUTATION,
} from 'client/graph/mutations';
import { useMutation } from 'react-apollo-hooks';
import CtxModal, { closeModal } from 'client/components/Modal';
import { useCtxDispatch } from 'client/components/ContextProvider';
import { CURRENT_USER_DEETS_QUERY } from 'client/graph/queries';
import postMutationUpdateCache from 'client/lib/postMutationUpdateCache';

export const DEET_TYPES = {
  address: {
    key: 'address',
    text: 'Address',
    value: 'address',
  },
  phone_number: {
    key: 'phone_number',
    text: 'Phone Number',
    value: 'phone_number',
  },
  email_address: {
    key: 'email_address',
    text: 'Email Address',
    value: 'email_address',
  },
};

export default function DeetCreator() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const dispatch = useCtxDispatch();

  const closeCreationModal = () => closeModal(dispatch);

  const showCreationModal = () => {
    dispatch({
      type: 'SET_MODAL',
      modal: (
        <DeetCreationModal
          closeCreationModal={closeCreationModal}
          setLoading={setLoading}
          loading={loading}
        />
      ),
    });
  };

  return (
    <div className="deet-creator">
      <div className="controls">
        <Button
          disabled={loading}
          positive
          icon
          labelPosition="left"
          onClick={showCreationModal}
        >
          <Icon name="plus" />
          Create
        </Button>
      </div>
      <style jsx>{`
        .deet-creator {
          margin-right: 30px;
        }
      `}</style>
    </div>
  );
}

interface ModalProps {
  closeCreationModal(): void;
  setLoading(b: boolean): void;
  loading: boolean;
}

const query = { query: CURRENT_USER_DEETS_QUERY };

function DeetCreationModal({
  closeCreationModal,
  setLoading,
  loading,
}: ModalProps) {
  const [creatingType, setCreatingType] = React.useState<DeetTypes>('address');

  const changeType = (_: any, { value }: { value: DeetTypes }) => {
    setCreatingType(value);
  };

  const upsertAddress = useMutation(UPSERT_ADDRESS_MUTATION, {
    update: (cache, { data }: { data: { upsertAddress: Deet } }) => {
      postMutationUpdateCache<{ userDeets: Array<Deet> }, Deet>({
        cache,
        query,
        fieldName: 'userDeets',
        type: 'unshift',
        targetObj: data.upsertAddress,
      });
    },
  });
  const upsertPhoneNumber = useMutation(UPSERT_PHONE_NUMBER_MUTATION, {
    update: (cache, { data }: { data: { upsertPhoneNumber: Deet } }) => {
      postMutationUpdateCache<{ userDeets: Array<Deet> }, Deet>({
        cache,
        query,
        fieldName: 'userDeets',
        type: 'unshift',
        targetObj: data.upsertPhoneNumber,
      });
    },
  });
  const upsertEmailAddress = useMutation(UPSERT_EMAIL_ADDRESS_MUTATION, {
    update: (cache, { data }: { data: { upsertEmailAddress: Deet } }) => {
      postMutationUpdateCache<{ userDeets: Array<Deet> }, Deet>({
        cache,
        query,
        fieldName: 'userDeets',
        type: 'unshift',
        targetObj: data.upsertEmailAddress,
      });
    },
  });

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
      await mutation({ variables });
    } catch (e) {
      setLoading(false);
      throw e;
    }

    setLoading(false);
    closeCreationModal();
  };

  return (
    <CtxModal size="small" closeOnDimmerClick={false}>
      <Header icon="plus" content={`Create ${DEET_TYPES[creatingType].text}`} />
      <Modal.Content>
        <div className="selector">
          <Dropdown
            value={creatingType}
            onChange={changeType}
            selection
            options={Object.values(DEET_TYPES)}
          />
        </div>
        <div className="creation-form-wrapper">
          {creatingType === 'address' && (
            <AddressCreator
              onClose={closeCreationModal}
              onSubmit={submitForm}
              loading={loading}
            />
          )}
          {creatingType === 'phone_number' && (
            <PhoneNumberCreator
              onClose={closeCreationModal}
              onSubmit={submitForm}
              loading={loading}
            />
          )}
          {creatingType === 'email_address' && (
            <EmailAddressCreator
              onClose={closeCreationModal}
              onSubmit={submitForm}
              loading={loading}
            />
          )}
        </div>
      </Modal.Content>
      <style jsx>{`
        .selector {
          display: flex;
          justify-content: center;
        }
        .creation-form-wrapper {
          margin: 20px 0;
        }
      `}</style>
    </CtxModal>
  );
}

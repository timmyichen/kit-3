import * as React from 'react';
import { Button, Icon, Dropdown, Header, Modal } from 'semantic-ui-react';
import { DeetTypes, Deet } from 'client/types';
import AddressCreator from './CreateAddress';
import PhoneNumberCreator from './CreatePhoneNumber';
import EmailAddressCreator from './CreateEmailAddress';
import CtxModal, { closeModal } from 'client/components/Modal';
import { useCtxDispatch } from 'client/components/ContextProvider';
import postMutationUpdateCache from 'client/lib/postMutationUpdateCache';
import {
  useUpsertAddressMutation,
  useUpsertPhoneNumberMutation,
  useUpsertEmailAddressMutation,
  UpsertAddressMutationVariables,
  UpsertPhoneNumberMutationVariables,
  UpsertEmailAddressMutationVariables,
  CurrentUserDeetsDocument,
} from 'generated/generated-types';
import updatePrimaryDeet from 'client/lib/updatePrimaryDeet';
import useMessages from 'client/hooks/useMessages';

type Variables =
  | UpsertAddressMutationVariables
  | UpsertPhoneNumberMutationVariables
  | UpsertEmailAddressMutationVariables;

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

const query = { query: CurrentUserDeetsDocument };

function DeetCreationModal({
  closeCreationModal,
  setLoading,
  loading,
}: ModalProps) {
  const [creatingType, setCreatingType] = React.useState<DeetTypes>('address');
  const { showError, showConfirm } = useMessages({ length: 4000 });

  const changeType = (_: any, { value }: { value: DeetTypes }) => {
    setCreatingType(value);
  };

  const upsertAddress = useUpsertAddressMutation();
  const upsertPhoneNumber = useUpsertPhoneNumberMutation();
  const upsertEmailAddress = useUpsertEmailAddressMutation();

  const submitForm = async (variables: Variables) => {
    setLoading(true);
    if (!variables.isPrimary) {
      variables.isPrimary = false;
    }

    try {
      switch (creatingType) {
        case 'address':
          const addressVars = variables as UpsertAddressMutationVariables;
          await upsertAddress({
            variables: addressVars,
            update: (cache, { data }) => {
              postMutationUpdateCache<{ userDeets: Array<Deet> }, Deet>({
                cache,
                query,
                fieldName: 'userDeets',
                type: 'unshift',
                targetObj: data!.upsertAddress,
              });
              if (variables.isPrimary) {
                updatePrimaryDeet(cache, data, 'upsertAddress');
              }
            },
          });
          break;
        case 'phone_number':
          const phoneVars = variables as UpsertPhoneNumberMutationVariables;
          await upsertPhoneNumber({
            variables: phoneVars,
            update: (cache, { data }) => {
              postMutationUpdateCache<{ userDeets: Array<Deet> }, Deet>({
                cache,
                query,
                fieldName: 'userDeets',
                type: 'unshift',
                targetObj: data!.upsertPhoneNumber,
              });
              if (variables.isPrimary) {
                updatePrimaryDeet(cache, data, 'upsertPhoneNumber');
              }
            },
          });
          break;
        case 'email_address':
          const emailVars = variables as UpsertEmailAddressMutationVariables;
          await upsertEmailAddress({
            variables: emailVars,
            update: (cache, { data }) => {
              postMutationUpdateCache<{ userDeets: Array<Deet> }, Deet>({
                cache,
                query,
                fieldName: 'userDeets',
                type: 'unshift',
                targetObj: data!.upsertEmailAddress,
              });
              if (variables.isPrimary) {
                updatePrimaryDeet(cache, data, 'upsertEmailAddress');
              }
            },
          });
          break;
        default:
          throw new Error(`Unrecognized type ${creatingType}`);
      }
    } catch (e) {
      setLoading(false);
      return showError(e.message);
    }

    showConfirm(`${DEET_TYPES[creatingType].text} created`);
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

import * as React from 'react';
import CtxModal, { closeModal } from 'client/components/Modal';
import { useCtxDispatch } from 'client/components/ContextProvider';
import {
  Deet,
  AddressDeet,
  EmailAddressDeet,
  PhoneNumberDeet,
} from 'client/types';
import { Header, Modal } from 'semantic-ui-react';
import AddressCreator from './CreateAddress';
import EmailAddressCreator from './CreateEmailAddress';
import PhoneNumberCreator from './CreatePhoneNumber';
import { CURRENT_USER_DEETS_QUERY } from 'client/graph/queries';
import {
  UPSERT_ADDRESS_MUTATION,
  UPSERT_PHONE_NUMBER_MUTATION,
  UPSERT_EMAIL_ADDRESS_MUTATION,
} from 'client/graph/mutations';
import { useMutation } from 'react-apollo-hooks';
import postMutationUpdateCache from 'client/lib/postMutationUpdateCache';

interface Props {
  deet: Deet;
}

const query = { query: CURRENT_USER_DEETS_QUERY };

export function EditDeetModal({ deet }: Props) {
  const [saving, setSaving] = React.useState<boolean>(false);
  const dispatch = useCtxDispatch();

  const onCloseModal = () => closeModal(dispatch);

  const upsertAddress = useMutation(UPSERT_ADDRESS_MUTATION, {
    update: (cache, { data }: { data: { upsertAddress: Deet } }) => {
      postMutationUpdateCache<{ userDeets: Array<Deet> }, Deet>({
        cache,
        query,
        fieldName: 'userDeets',
        type: 'replace',
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
        type: 'replace',
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
        type: 'replace',
        targetObj: data.upsertEmailAddress,
      });
    },
  });

  const submitForm = async (variables: Object) => {
    let mutation;
    switch (deet.type) {
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
        throw new Error(`Unrecognized type ${deet.type}`);
    }

    setSaving(true);
    try {
      await mutation({ variables: { ...variables, deetId: deet.id } });
    } catch (e) {
      setSaving(false);
      throw e;
    }

    setSaving(false);
    onCloseModal();
  };

  let content;
  switch (deet.type) {
    case 'address':
      content = (
        <AddressCreator
          onClose={onCloseModal}
          onSubmit={submitForm}
          loading={saving}
          address={deet as AddressDeet}
          ctaText="Save"
          isModal
        />
      );
      break;
    case 'email_address':
      content = (
        <EmailAddressCreator
          onClose={onCloseModal}
          onSubmit={submitForm}
          loading={saving}
          email={deet as EmailAddressDeet}
          ctaText="Save"
          isModal
        />
      );
      break;
    case 'phone_number':
      content = (
        <PhoneNumberCreator
          onClose={onCloseModal}
          onSubmit={submitForm}
          loading={saving}
          phone={deet as PhoneNumberDeet}
          ctaText="Save"
          isModal
        />
      );
      break;
  }

  return (
    <div className="edit-deet-modal">
      <CtxModal size="tiny">
        <Header icon="pencil alternate" content={`Edit ${deet.label}`} />
        <Modal.Content>{content}</Modal.Content>
      </CtxModal>
      <style jsx>{``}</style>
    </div>
  );
}

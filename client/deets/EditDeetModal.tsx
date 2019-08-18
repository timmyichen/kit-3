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
import AddressCreator from './AddressCreator';
import EmailAddressCreator from './EmailAddressCreator';
import PhoneNumberCreator from './PhoneNumberCreator';
import {
  useUpsertAddressMutation,
  useUpsertPhoneNumberMutation,
  useUpsertEmailAddressMutation,
  UpsertAddressMutationVariables,
  UpsertPhoneNumberMutationVariables,
  UpsertEmailAddressMutationVariables,
} from 'generated/generated-types';
import useMessages from 'client/hooks/useMessages';

interface Props {
  deet: Deet;
}

export function EditDeetModal({ deet }: Props) {
  const [saving, setSaving] = React.useState<boolean>(false);
  const dispatch = useCtxDispatch();
  const { showError, showConfirm } = useMessages({ length: 4000 });

  const onCloseModal = () => closeModal(dispatch);

  const upsertAddress = useUpsertAddressMutation();
  const upsertPhoneNumber = useUpsertPhoneNumberMutation();
  const upsertEmailAddress = useUpsertEmailAddressMutation();

  const submitForm = async (variables: Object) => {
    setSaving(true);
    try {
      switch (deet.type) {
        case 'address':
          const addressVars = variables as UpsertAddressMutationVariables;
          await upsertAddress({
            variables: { ...addressVars, deetId: deet.id },
          });
          break;
        case 'phone_number':
          const phoneVars = variables as UpsertPhoneNumberMutationVariables;
          await upsertPhoneNumber({
            variables: { ...phoneVars, deetId: deet.id },
          });
          break;
        case 'email_address':
          const emailVars = variables as UpsertEmailAddressMutationVariables;
          await upsertEmailAddress({
            variables: { ...emailVars, deetId: deet.id },
          });
          break;
        default:
          throw new Error(`Unrecognized type ${deet.type}`);
      }
    } catch (e) {
      setSaving(false);
      return showError(e.message);
    }

    showConfirm('Deet saved');
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

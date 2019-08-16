import * as React from 'react';
import { useCtxState } from 'client/components/ContextProvider';
import { Form, Header, Input, Button } from 'semantic-ui-react';
import { useUpdateUserMutation } from 'generated/generated-types';
import Loader from 'client/components/Loader';
import useMessages from 'client/hooks/useMessages';

interface AccountFields {
  birthday?: string | null;
  email: string;
  familyName: string;
  givenName: string;
  passwordVerification: string;
}

const emptyState = {
  birthday: null,
  email: '',
  familyName: '',
  givenName: '',
  birthdayDate: null,
  birthdayYear: null,
  passwordVerification: '',
};

const pad = (num: number) => (num < 10 ? '0' + num : '' + num);

function UserUpdateForm() {
  const currentUserState = useCtxState().currentUser;
  let currentUser = currentUserState;

  const { showError, showConfirm } = useMessages({ length: 4000 });

  React.useEffect(() => {
    if (!currentUserState) {
      return;
    }

    let birthday;
    if (currentUserState.birthdayDate) {
      const bdayAsDate = new Date(currentUserState.birthdayDate);
      if (isNaN(bdayAsDate.getMonth()) === false) {
        birthday =
          currentUserState.birthdayYear +
          '-' +
          pad(bdayAsDate.getMonth() + 1) +
          '-' +
          pad(bdayAsDate.getDate() + 1);
      }
    }

    setFields({
      email: currentUserState.email,
      familyName: currentUserState.familyName,
      givenName: currentUserState.givenName,
      passwordVerification: '',
      birthday,
    });
  }, [currentUserState]);

  const [fields, setFields] = React.useState<AccountFields>(emptyState);
  const [loading, setLoading] = React.useState<boolean>(false);

  const updateUser = useUpdateUserMutation();

  if (!currentUser) {
    return <Loader />;
  }

  const setValue = (field: keyof AccountFields, value: any) => {
    const updatedFields = fields;
    updatedFields[field] = value;
    setFields(prevState => ({
      ...prevState,
      ...updatedFields,
    }));
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      await updateUser({ variables: fields });
    } catch (e) {
      setLoading(false);
      return showError(e.message);
    }

    showConfirm('Updated profile');
    setLoading(false);
    setFields(prevState => ({
      ...prevState,
      passwordVerification: '',
    }));
  };

  return (
    <div className="user-update-form-wrapper">
      <Header as="h1">Update Account Information</Header>

      <Form>
        <Form.Field required>
          <label>Email</label>
          <Input
            value={fields.email}
            onChange={(_, { value }: { value: string }) =>
              setValue('email', value)
            }
          />
        </Form.Field>
        <Form.Group className="names">
          <Form.Field required>
            <label>Given (First) Name</label>
            <Input
              value={fields.givenName}
              onChange={(_, { value }: { value: string }) =>
                setValue('givenName', value)
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Family (Last) Name</label>
            <Input
              value={fields.familyName}
              onChange={(_, { value }: { value: string }) =>
                setValue('familyName', value)
              }
            />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <label>Birthday</label>
          <Input
            value={fields.birthday}
            onChange={(_, { value }: { value: string }) =>
              setValue('birthday', value)
            }
            type="date"
          />
        </Form.Field>
        <Form.Field>
          <label>Enter your current password</label>
          <Input
            value={fields.passwordVerification}
            onChange={(_, { value }: { value: string }) =>
              setValue('passwordVerification', value)
            }
            type="password"
          />
        </Form.Field>
        <Button
          type="submit"
          disabled={loading}
          color="green"
          onClick={onSubmit}
        >
          Save
        </Button>
      </Form>
      <style jsx>{`
        .user-update-form-wrapper {
          padding-top: 30px;
          max-width: 400px;
          margin: 0 auto;
        }
        .user-update-form-wrapper :global(.names > div) {
          flex-grow: 1 !important;
        }
      `}</style>
    </div>
  );
}

export default UserUpdateForm;

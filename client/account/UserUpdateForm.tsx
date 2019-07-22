import * as React from 'react';
import { useCtxState } from 'client/components/ContextProvider';
import { Form, Header, Input, Button } from 'semantic-ui-react';
import { useUpdateUserMutation } from 'generated/generated-types';
import Loader from 'client/components/Loader';

interface AccountFields {
  birthday?: string | null;
  email: string;
  familyName: string;
  givenName: string;
  passwordVerification: string;
}

const pad = (num: number) => (num < 10 ? '0' + num : '' + num);

function UserUpdateForm() {
  const { currentUser } = useCtxState();

  if (!currentUser) {
    return <Loader />;
  }

  const updateUser = useUpdateUserMutation();

  let birthday;
  if (currentUser.birthdayDate) {
    const bdayAsDate = new Date(currentUser.birthdayDate);
    if (isNaN(bdayAsDate.getMonth()) === false) {
      birthday =
        currentUser.birthdayYear +
        '-' +
        pad(bdayAsDate.getMonth()) +
        '-' +
        pad(bdayAsDate.getDate());
    }
  }

  const [fields, setFields] = React.useState<AccountFields>({
    email: currentUser.email,
    familyName: currentUser.familyName,
    givenName: currentUser.givenName,
    passwordVerification: '',
    birthday,
  });
  const [loading, setLoading] = React.useState<boolean>(false);

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
      throw e;
    }

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

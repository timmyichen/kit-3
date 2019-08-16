import * as React from 'react';
import { useCtxState } from 'client/components/ContextProvider';
import { Form, Header, Input, Button } from 'semantic-ui-react';
import Loader from 'client/components/Loader';
import { useUpdatePasswordMutation } from 'generated/generated-types';
import useMessages from 'client/hooks/useMessages';

function NewPasswordForm() {
  const { currentUser } = useCtxState();

  const { showError, showConfirm } = useMessages({ length: 4000 });

  const updatePassword = useUpdatePasswordMutation();

  const [passwordVerification, setPasswordVerification] = React.useState<
    string
  >('');
  const [newPassword, setNewPassword] = React.useState<string>('');
  const [newPasswordVerify, setNewPasswordVerify] = React.useState<string>('');

  const [loading, setLoading] = React.useState<boolean>(false);

  if (!currentUser) {
    return <Loader />;
  }

  const onSubmit = async () => {
    setLoading(true);
    try {
      await updatePassword({
        variables: { passwordVerification, newPassword },
      });
    } catch (e) {
      setLoading(false);
      return showError(e.message);
    }

    showConfirm('Password updated');
    setLoading(false);
    setPasswordVerification('');
    setNewPassword('');
    setNewPasswordVerify('');
  };

  return (
    <div className="user-update-password-wrapper">
      <Header as="h1">Update Password</Header>

      <Form>
        <Form.Field required>
          <label>Password</label>
          <Input
            value={passwordVerification}
            type="password"
            onChange={(_, { value }: { value: string }) =>
              setPasswordVerification(value)
            }
          />
        </Form.Field>
        <Form.Field required>
          <label>New Password</label>
          <Input
            value={newPassword}
            type="password"
            onChange={(_, { value }: { value: string }) =>
              setNewPassword(value)
            }
          />
        </Form.Field>
        <Form.Field required>
          <label>New Password (verify)</label>
          <Input
            value={newPasswordVerify}
            type="password"
            onChange={(_, { value }: { value: string }) =>
              setNewPasswordVerify(value)
            }
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
        .user-update-password-wrapper {
          padding-top: 30px;
          max-width: 400px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}

export default NewPasswordForm;

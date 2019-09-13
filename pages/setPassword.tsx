import * as React from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button } from 'semantic-ui-react';
import Link from 'next/link';
import { useSetForgottenPasswordMutation } from 'generated/generated-types';
import useMessages from 'client/hooks/useMessages';

function SetPasswordPage() {
  const router = useRouter();
  const token = router.query ? String(router.query.token) : '';

  const { showError } = useMessages({ length: 5000 });

  const [password, setPassword] = React.useState('');
  const [passwordVerification, setPasswordVerification] = React.useState('');
  const [successful, setSuccessful] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const updatePassword = useSetForgottenPasswordMutation();

  if (!token) {
    return null;
  }

  const onSubmit = async () => {
    if (password !== passwordVerification) {
      return showError('Both fields must match');
    }

    if (password.length < 8) {
      return showError('Password must be at least 8 characters long');
    }

    setLoading(true);
    try {
      await updatePassword({ variables: { token, newPassword: password } });
    } catch (e) {
      showError(e.message);
      setLoading(false);

      return;
    }

    setSuccessful(true);
    setLoading(false);
  };

  return (
    <div className="set-password-page">
      {successful ? (
        <h2>
          Success. Log in with your new password{' '}
          <Link href="/login">
            <a>here</a>
          </Link>
          .
        </h2>
      ) : (
        <Form>
          <Form.Field>
            <label>New Password</label>
            <Input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.currentTarget.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Verify Password</label>
            <Input
              required
              type="password"
              value={passwordVerification}
              onChange={e => setPasswordVerification(e.currentTarget.value)}
            />
          </Form.Field>
          <Button type="submit" loading={loading} positive onClick={onSubmit}>
            Submit
          </Button>
        </Form>
      )}
      <style jsx>{`
        .set-password-page {
          min-height: 400px;
        }
        .set-password-page :global(form),
        h2 {
          max-width: 400px;
          margin: 100px auto;
        }
        h2 {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default SetPasswordPage;

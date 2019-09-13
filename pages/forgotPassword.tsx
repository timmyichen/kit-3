import * as React from 'react';
import { Form, Input, Button, Header } from 'semantic-ui-react';
import useMessages from 'client/hooks/useMessages';
import { isEmail } from 'validator';
import { useRequestPasswordResetMutation } from 'generated/generated-types';

function ForgotPasswordPage() {
  const { showError, showConfirm } = useMessages({ length: 5000 });

  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const requestPasswordReset = useRequestPasswordResetMutation();

  const onSubmit = async () => {
    if (!isEmail(email)) {
      return showError('Invalid email');
    }

    setLoading(true);
    try {
      await requestPasswordReset({ variables: { email } });
    } catch (e) {
      showError(e.message);
      setLoading(false);

      return;
    }

    showConfirm(
      'If there is an email associated with that account, we sent it an email with further instructions.',
    );
    setLoading(false);
  };

  return (
    <div className="forgot-password-page">
      <Form>
        <Header as="h2">Forgot your password?</Header>
        <p>
          Don't worry. Happens to the best of us. Just put your email and we'll
          send you instructions on how to reset it.
        </p>
        <Form.Field>
          <label>Email</label>
          <Input
            required
            placeholder="Email of the account that needs a password"
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
          />
        </Form.Field>
        <Button type="submit" loading={loading} positive onClick={onSubmit}>
          Submit
        </Button>
      </Form>
      <style jsx>{`
        .forgot-password-page {
          min-height: 400px;
        }
        .forgot-password-page :global(form) {
          max-width: 400px;
          margin: 100px auto;
        }
      `}</style>
    </div>
  );
}

export default ForgotPasswordPage;

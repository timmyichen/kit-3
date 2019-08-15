import * as React from 'react';
import classnames from 'classnames';
import { Button, Checkbox, Form } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-fetch';
import { useCtxDispatch } from 'client/components/ContextProvider';
import colors from 'client/styles/colors';

export default () => {
  const [givenName, setGivenName] = React.useState<string>('');
  const [familyName, setFamilyName] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [termsAgreement, setTermsAgreement] = React.useState<boolean>(false);
  const [highlightTerms, setHighlightTerms] = React.useState<boolean>(false);

  const router = useRouter();
  const dispatch = useCtxDispatch();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termsAgreement) {
      setHighlightTerms(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/signup', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          givenName,
          familyName,
          username,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message);
      }
    } catch (e) {
      setLoading(false);
      dispatch({
        type: 'ADD_MESSAGE',
        messageType: 'error',
        time: 4000,
        content: e.message,
      });
      return;
    }

    setLoading(false);

    router.push('/dashboard');
  };

  return (
    <div className="signup-wrapper">
      <Form onSubmit={onSubmit} method="POST">
        <Form.Field>
          <label>First Name (Given Name)</label>
          <input
            required
            value={givenName}
            name="givenName"
            placeholder="First Name"
            onChange={e => setGivenName(e.currentTarget.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Last Name (Family Name)</label>
          <input
            required
            value={familyName}
            name="familyName"
            placeholder="Last Name"
            onChange={e => setFamilyName(e.currentTarget.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Username</label>
          <input
            required
            value={username}
            name="username"
            placeholder="Username"
            onChange={e => setUsername(e.currentTarget.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Email</label>
          <input
            required
            value={email}
            name="email"
            placeholder="Email"
            onChange={e => setEmail(e.currentTarget.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            required
            type="password"
            value={password}
            name="password"
            placeholder="Password"
            onChange={e => setPassword(e.currentTarget.value)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            className={classnames('checkbox', { highlight: highlightTerms })}
            onChange={() => {
              setTermsAgreement(!termsAgreement);
              setHighlightTerms(false);
            }}
            label="I agree to the Terms and Conditions"
            required
          />
        </Form.Field>
        <Button disabled={loading} type="submit">
          Sign Up
        </Button>
      </Form>
      <style jsx>{`
        .signup-wrapper :global(.ui.form) {
          max-width: 400px;
          margin: 50px auto;
        }
        .signup-wrapper :global(.checkbox) {
          border: 1px solid transparent;
          padding: 5px;
        }
        .signup-wrapper :global(.highlight) {
          border: 2px solid ${colors.red};
        }
      `}</style>
    </div>
  );
};

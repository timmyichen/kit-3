import * as React from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-fetch';

export default () => {
  const [givenName, setGivenName] = React.useState<string>('');
  const [familyName, setFamilyName] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [termsAgreement, setTermsAgreement] = React.useState<boolean>(false);

  const router = useRouter();

  const onSubmit = async () => {
    if (!termsAgreement) {
      console.log('you must agree to our shit');
      return;
    }

    setLoading(true);

    try {
      await fetch('/signup', {
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
    } catch (e) {
      setLoading(false);
      console.log(e.message);
      return;
    }

    setLoading(false);

    router.push('/dashboard');
  };

  return (
    <div className="signup-wrapper">
      <Form>
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
            onChange={() => setTermsAgreement(!termsAgreement)}
            label="I agree to the Terms and Conditions"
            required
          />
        </Form.Field>
        <Button disabled={loading} type="submit" onClick={onSubmit}>
          Sign Up
        </Button>
      </Form>
      <style jsx>{`
        .signup-wrapper :global(.ui.form) {
          max-width: 400px;
          margin: 50px auto;
        }
      `}</style>
    </div>
  );
};

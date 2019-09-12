import * as React from 'react';
import { Button, Form } from 'semantic-ui-react';
import fetch from 'isomorphic-fetch';
import { useCtxDispatch } from 'client/components/ContextProvider';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Meta from 'client/components/Meta';

function LoginPage() {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const dispatch = useCtxDispatch();

  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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

    if (router.query && router.query.goto) {
      window.location.href = String(router.query.goto);
    } else {
      router.push('/dashboard');
    }
  };

  const signupLink =
    router.query && router.query.goto
      ? `/signup?goto=${router.query.goto}`
      : '/signup';

  return (
    <div>
      <Meta title="Log In" />
      <p>
        New to Keep In Touch?{' '}
        <Link href={signupLink}>
          <a>Sign up</a>
        </Link>{' '}
        instead.
      </p>
      <Form onSubmit={onSubmit} method="POST">
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
            value={password}
            name="password"
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.currentTarget.value)}
          />
        </Form.Field>
        <Button disabled={loading} type="submit">
          Log in
        </Button>
      </Form>
      <style jsx>{`
        div {
          max-width: 400px;
          margin: 50px auto;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;

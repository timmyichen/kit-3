import * as React from 'react';
import classnames from 'classnames';
import {
  Button,
  Checkbox,
  Form,
  Message,
  Input,
  Icon,
} from 'semantic-ui-react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-fetch';
import { useCtxDispatch } from 'client/components/ContextProvider';
import colors from 'client/styles/colors';
import Link from 'next/link';
import {
  useRequestFriendMutation,
  DoesUsernameExistDocument,
  DoesUsernameExistQuery,
} from 'generated/generated-types';
import Meta from 'client/components/Meta';
import { isEmail } from 'validator';
import debounce from 'lodash/debounce';
import { withApollo, WithApolloClient } from 'react-apollo';

interface Errors {
  email?: string;
  givenName?: string;
  username?: string;
  password?: string;
}

const usernameRegex = /^[a-z0-9]{4,24}$/g;
const isValidUsername = (username: string) =>
  username && username.match(usernameRegex);

function SignupPage({ client }: WithApolloClient<{}>) {
  const [givenName, setGivenName] = React.useState('');
  const [familyName, setFamilyName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [termsAgreement, setTermsAgreement] = React.useState(false);
  const [highlightTerms, setHighlightTerms] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [searchingUsername, setSearchingUsername] = React.useState(false);
  console.log(searchingUsername);

  const router = useRouter();
  const dispatch = useCtxDispatch();

  const referrer =
    (router.query &&
      router.query.referrer &&
      router.query.referrer.toString()) ||
    '';
  const addFriend = useRequestFriendMutation({
    variables: { targetUserId: parseInt(referrer, 10) },
  });

  const searchUsername = React.useRef(
    debounce(async (newUsername: string) => {
      if (!isValidUsername(newUsername)) {
        setErrors({
          ...errors,
          username:
            'Username must be between 4 and 24 characters and only have lowercase alphanumeric characters',
        });
        setSearchingUsername(false);
        return;
      }

      const { data } = await client.query<DoesUsernameExistQuery>({
        query: DoesUsernameExistDocument,
        variables: { username: newUsername },
      });
      setSearchingUsername(false);

      if (data && data.userByUsername) {
        setErrors({
          ...errors,
          username: 'That username is taken',
        });
      }
    }, 500),
  );

  React.useEffect(() => {
    if (!username) {
      return;
    }

    searchUsername.current(username);
  }, [username]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termsAgreement) {
      setHighlightTerms(true);
      return;
    }

    const newErrors: Errors = {};

    if (!email || !isEmail(email)) {
      newErrors.email = 'Invalid email';
    }

    if (!isValidUsername(username) || errors.username) {
      newErrors.username =
        'Username must be between 4 and 24 characters and only have lowercase alphanumeric characters';
    }

    if (!givenName || !givenName.trim()) {
      newErrors.givenName = 'First name is required';
    }

    if (!password || password.length < 8) {
      newErrors.password = 'Your password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
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

    if (referrer) {
      await addFriend();
    }

    setLoading(false);

    if (router.query && router.query.goto) {
      window.location.href = String(router.query.goto);
    } else {
      router.push('/dashboard');
    }
  };

  const loginLink =
    router.query && router.query.goto
      ? `/login?goto=${router.query.goto}`
      : '/login';

  let icon: {
    name?: 'check circle outline' | 'times circle outline' | undefined;
    color?: 'red' | 'green' | undefined;
  } = {};
  if (errors.username) {
    icon.name = 'times circle outline';
    icon.color = 'red';
  } else if (username) {
    icon.name = 'check circle outline';
    icon.color = 'green';
  } else {
    icon = {};
  }

  return (
    <div className="signup-wrapper">
      <Meta title="Sign Up" />
      <Form onSubmit={onSubmit} method="POST">
        <p>
          Have an account?{' '}
          <Link href={loginLink}>
            <a>Log in</a>
          </Link>{' '}
          instead
        </p>
        <Form.Field>
          <label>First Name (Given Name)</label>
          <Input
            required
            value={givenName}
            name="givenName"
            placeholder="First Name"
            onChange={e => {
              setErrors({ ...errors, givenName: undefined });
              setGivenName(e.currentTarget.value);
            }}
          />
          {errors.givenName && (
            <Message size="tiny" negative>
              {errors.givenName}
            </Message>
          )}
        </Form.Field>
        <Form.Field>
          <label>Last Name (Family Name)</label>
          <Input
            value={familyName}
            name="familyName"
            placeholder="Last Name"
            onChange={e => setFamilyName(e.currentTarget.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Username</label>
          <Input
            required
            loading={searchingUsername}
            value={username}
            name="username"
            placeholder="Username"
            onChange={e => {
              setErrors({ ...errors, username: undefined });
              setSearchingUsername(true);
              setUsername(e.currentTarget.value);
            }}
            icon={
              icon.name ? (
                <Icon name={icon.name} color={icon.color} />
              ) : (
                undefined
              )
            }
          />
          {errors.username && (
            <Message size="tiny" negative>
              {errors.username}
            </Message>
          )}
        </Form.Field>
        <Form.Field>
          <label>Email</label>
          <Input
            required
            value={email}
            name="email"
            placeholder="Email"
            onChange={e => {
              setErrors({ ...errors, email: undefined });
              setEmail(e.currentTarget.value);
            }}
          />
          {errors.email && (
            <Message size="tiny" negative>
              {errors.email}
            </Message>
          )}
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <Input
            required
            type="password"
            value={password}
            name="password"
            placeholder="Password"
            onChange={e => {
              setErrors({ ...errors, password: undefined });
              setPassword(e.currentTarget.value);
            }}
          />
          {errors.password && (
            <Message size="tiny" negative>
              {errors.password}
            </Message>
          )}
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
}

export default withApollo(SignupPage);

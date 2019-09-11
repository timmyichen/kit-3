import * as React from 'react';
import { Loader, Message } from 'semantic-ui-react';
import Router, { WithRouterProps, withRouter } from 'next/router';
import { useVerifyUserMutation } from 'generated/generated-types';
import { removeGql } from 'client/hooks/useMessages';

function VerifyPage(props: WithRouterProps) {
  let hash = '';

  if (
    props.router &&
    props.router &&
    props.router.query &&
    props.router.query.token
  ) {
    hash = String(props.router.query.token);
  }

  const [verifying, setVerifying] = React.useState(true);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const timeoutId = React.useRef<NodeJS.Timeout | null>(null);

  const verifyUser = useVerifyUserMutation({ variables: { hash } });

  const timeoutError = () => {
    setError(
      'Failed to verify, took longer than 15 seconds. Please contact support @ please@kit-with.me',
    );
    setVerifying(false);
  };

  const completedVerification = () => {
    setVerifying(false);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
  };

  React.useEffect(() => {
    timeoutId.current = setTimeout(timeoutError, 15000);
    return () => {
      timeoutId.current && clearTimeout(timeoutId.current);
    };
  }, []);

  React.useEffect(() => {
    const verify = async () => {
      try {
        await verifyUser();
      } catch (e) {
        setError(removeGql(e.message));
        return completedVerification();
      }

      completedVerification();
      setSuccess(true);
      setTimeout(() => Router.push('/dashboard'), 10000);
    };

    verify();
  }, []);

  return (
    <div className="verify-page">
      <Loader active={verifying}>Verifying your email...</Loader>
      {error && (
        <Message className="error" negative>
          {error}
        </Message>
      )}
      {success && (
        <Message className="success" positive>
          Verification successful! Redirecting to dashboard...
        </Message>
      )}
      <style jsx>{`
        .verify-page {
          position: relative;
          min-height: 300px;
          padding: 40px;
        }
        .verify-page :global(.error),
        .verify-page :global(.success) {
          max-width: 450px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}

export default withRouter(VerifyPage);

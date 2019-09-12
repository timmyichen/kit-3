import * as React from 'react';
import { Header, Message } from 'semantic-ui-react';
import { useCtxState } from 'client/components/ContextProvider';
import Link from 'next/link';
import {
  useUserTodosQuery,
  useRequestVerificationEmailMutation,
} from 'generated/generated-types';
import Loader from 'client/components/Loader';
import useMessages from 'client/hooks/useMessages';

function Todos() {
  const { currentUser } = useCtxState();

  const { data, loading } = useUserTodosQuery({ fetchPolicy: 'network-only' });
  const { showConfirm, showError } = useMessages({ length: 4000 });

  const requestVerification = useRequestVerificationEmailMutation();
  const [requesting, setRequesting] = React.useState(false);

  let content;
  if (loading || !data || !currentUser) {
    content = <Loader />;
  } else {
    const hasBirthday = !!currentUser.birthdayDate;
    const hasProfilePicture = !!currentUser.profilePictureId;
    const isVerified = currentUser.isVerified;
    const {
      hasFriends,
      hasDeets,
      hasPrimaryAddress,
      hasPrimaryPhoneNumber,
      hasPrimaryEmailAddress,
    } = data.userTodos;

    if (
      hasBirthday &&
      hasFriends &&
      hasDeets &&
      hasPrimaryAddress &&
      hasPrimaryEmailAddress &&
      hasPrimaryPhoneNumber &&
      hasProfilePicture &&
      isVerified
    ) {
      return null;
    }

    const requestEmailVerification = async () => {
      if (requesting) {
        return;
      }

      setRequesting(true);

      try {
        await requestVerification();
      } catch (e) {
        showError(e.message);
        setRequesting(false);

        return;
      }

      setRequesting(false);
      showConfirm('Verification email resent');
    };

    content = (
      <div className="content">
        {!isVerified && (
          <div className="reminder">
            <Message info>
              <Message.Header>Your email is unverified</Message.Header>
              Check your email for a verification link. Don't see one?{' '}
              <a onClick={requestEmailVerification}>
                Resend verification email
              </a>
              .
            </Message>
          </div>
        )}
        {!hasBirthday && (
          <div className="reminder">
            <Message info>
              <Message.Header>You don't have a birthday set.</Message.Header>
              <Link href="/account">
                <a>Update your account</a>
              </Link>{' '}
              so friends can be notified!
            </Message>
          </div>
        )}
        {!hasProfilePicture && (
          <div className="reminder">
            <Message info>
              <Message.Header>
                You haven't uploaded a profile picture.
              </Message.Header>
              <Link href="/account">
                <a>Upload one</a>
              </Link>{' '}
              so your friends will recognize you!
            </Message>
          </div>
        )}
        {!hasFriends && (
          <div className="reminder">
            <Message info>
              <Message.Header>
                You haven't added any friends yet.
              </Message.Header>
              <Link href="/friends/find">
                <a>Find some friends</a>
              </Link>{' '}
              by searching for their name or username.
            </Message>
          </div>
        )}
        {!hasDeets && (
          <div className="reminder">
            <Message info>
              <Message.Header>You don't have any deets.</Message.Header>
              <Link href="/deets">
                <a>Add a deet</a>
              </Link>{' '}
              to share with your friends.
            </Message>
          </div>
        )}
        {hasDeets && !hasPrimaryAddress && (
          <div className="reminder">
            <Message info>
              <Message.Header>
                You don't have a primary address yet.
              </Message.Header>
              Add an address or mark an address as primary on your{' '}
              <Link href="/deets">
                <a>deets dashboard</a>
              </Link>
              .
            </Message>
          </div>
        )}
        {hasDeets && !hasPrimaryPhoneNumber && (
          <div className="reminder">
            <Message info>
              <Message.Header>
                You don't have a primary phone number yet.
              </Message.Header>
              Add a phone number or mark a phone number as primary on your{' '}
              <Link href="/deets">
                <a>deets dashboard</a>
              </Link>
              .
            </Message>
          </div>
        )}
        {hasDeets && !hasPrimaryEmailAddress && (
          <div className="reminder">
            <Message info>
              <Message.Header>
                You don't have a primary email address yet.
              </Message.Header>
              Add an email address or mark an email address as primary on your{' '}
              <Link href="/deets">
                <a>deets dashboard</a>
              </Link>
              .
            </Message>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-todos">
      <Header as="h2">Reminders</Header>
      {content}
      <style jsx>{`
        .dashboard-todos {
          margin-top: 30px;
        }
        .dashboard-todos :global(.reminder) {
          margin: 5px 0 5px 10px;
        }
        .dashboard-todos :global(.reminder a) {
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default Todos;

import * as React from 'react';
import { Header, Message } from 'semantic-ui-react';
import { useCtxState } from 'client/components/ContextProvider';
import Link from 'next/link';
import { useUserTodosQuery } from 'generated/generated-types';
import Loader from 'client/components/Loader';

function Todos() {
  const { currentUser } = useCtxState();

  const { data, loading } = useUserTodosQuery();

  let content;
  if (loading || !data || !currentUser) {
    content = <Loader />;
  } else {
    const hasBirthday = !!currentUser.birthdayDate;
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
      hasPrimaryPhoneNumber
    ) {
      return null;
    }

    content = (
      <div className="content">
        {!hasBirthday && (
          <div className="reminder">
            <Message info>
              <Message.Header>You don't have a birthday set.</Message.Header>
              <Link href="/account">
                <a>Update your account</a>
              </Link>{' '}
              so friends can send you things!
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
        }
      `}</style>
    </div>
  );
}

export default Todos;

import * as React from 'react';
import { Header } from 'semantic-ui-react';
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
            You don't have a birthday set.{' '}
            <Link href="/account">
              <a>Update your account</a>
            </Link>{' '}
            so friends can send you things!
          </div>
        )}
        {!hasFriends && (
          <div className="reminder">
            <Link href="/friends/find">
              <a>Find some friends</a>
            </Link>{' '}
            by searching for their name or username.
          </div>
        )}
        {!hasDeets && (
          <div className="reminder">
            <Link href="/deets">
              <a>Add a deet</a>
            </Link>{' '}
            to share with your friends.
          </div>
        )}
        {!hasPrimaryAddress && (
          <div className="reminder">
            You don't have a primary address yet.{' '}
            <Link href="/deets">
              <a>Add one now</a>
            </Link>
            .
          </div>
        )}
        {!hasPrimaryPhoneNumber && (
          <div className="reminder">
            You don't have a primary phone number yet.{' '}
            <Link href="/deets">
              <a>Add one now</a>
            </Link>
            .
          </div>
        )}
        {!hasPrimaryEmailAddress && (
          <div className="reminder">
            You don't have a primary email address yet.{' '}
            <Link href="/deets">
              <a>Add one now</a>
            </Link>
            .
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
      `}</style>
    </div>
  );
}

export default Todos;

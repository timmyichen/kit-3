import * as React from 'react';
import { WithRouterProps, withRouter } from 'next/router';
import { useFriendByUsernameQuery } from 'generated/generated-types';
import Loader from 'client/components/Loader';
import { Header } from 'semantic-ui-react';
import { DeetCard } from 'client/deets/DeetCard';
import useWindowSize from 'client/hooks/useWindowSize';
import { isBrowser, splitColumns } from 'client/lib/dom';
import ProfileImage from 'client/components/ProfileImage';
import { getDateString, getCurrentTimezoneDate } from 'client/lib/date';

const FriendPage = (props: WithRouterProps) => {
  const [colCount, setColCount] = React.useState<number>(3);

  if (isBrowser) {
    const size = useWindowSize();
    React.useEffect(() => {
      const cols = size && size.width ? Math.floor(size.width / 350) : 3;
      setColCount(cols || 1);
    }, [size.width]);
  }

  const username =
    props.router && props.router.query && props.router.query.username;

  if (!username || typeof username !== 'string') {
    throw new Error('Missing or invalid username');
  }

  const { data, loading } = useFriendByUsernameQuery({
    variables: { username },
  });

  if (loading || !data) {
    return <Loader />;
  }

  const friend = data.friend;

  return (
    <div className="friend-page">
      <div className="profile-info">
        <Header as="h1">{friend.fullName}</Header>
        <Header as="h3" className="username-label">
          {friend.username}
        </Header>
        <ProfileImage
          profileImageUrl={friend.profilePicture}
          height={150}
          width={150}
        />
        {friend.birthday && (
          <div className="birthday">
            Birthday:{' '}
            {getDateString(getCurrentTimezoneDate(new Date(friend.birthday)), {
              withYear: true,
            })}
          </div>
        )}
      </div>
      {!!friend.sharedDeets.length && (
        <>
          <Header as="h2">{friend.givenName}'s shared deets</Header>
          <div className="deets-container">
            {splitColumns(
              friend.sharedDeets.map(deet => (
                <DeetCard key={`deet-${deet.id}`} deet={deet} isOwner={false} />
              )),
              colCount,
            )}
          </div>
        </>
      )}
      {!!friend.viewableDeets.length && (
        <>
          <Header as="h2">Deets you've shared with {friend.givenName}</Header>
          <div className="deets-container">
            {splitColumns(
              friend.viewableDeets.map(deet => (
                <DeetCard key={`deet-${deet.id}`} deet={deet} isOwner />
              )),
              colCount,
            )}
          </div>
        </>
      )}
      <style jsx>{`
        .friend-page {
          padding: 30px;
        }
        .deets-container :global(.deet-item) {
          display: inline-block;
          padding: 15px;
        }
        .birthday {
          margin-top: 15px;
          font-size: 20px;
        }
        .profile-info {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .profile-info :global(.username-label) {
          margin-top: 0px;
          margin-bottom: 20px;
        }
        .profile-info :global(h1) {
          margin-bottom: 0px;
        }
      `}</style>
    </div>
  );
};

export default withRouter(FriendPage);

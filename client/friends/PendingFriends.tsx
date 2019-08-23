import * as React from 'react';
import { Card, Button, Header } from 'semantic-ui-react';
import { User } from 'client/types';
import BlockUserModal from 'client/components/BlockUserModal';
import { useCtxDispatch } from 'client/components/ContextProvider';
import Loader from 'client/components/Loader';
import { splitColumns } from 'client/lib/dom';
import { FetchResult } from 'react-apollo';
import { PAGE_COUNT } from './FriendItem';
import postMutationUpdateCache from 'client/lib/postMutationUpdateCache';
import {
  usePendingFriendRequestsQuery,
  PendingFriendRequestsDocument,
  FriendsDocument,
  useAcceptFriendRequestMutation,
  PendingFriendRequestsQuery,
  FriendsQuery,
} from 'generated/generated-types';
import useMessages from 'client/hooks/useMessages';
import ProfileImage from 'client/components/ProfileImage';

const PendingFriends = ({ colCount }: { colCount: number }) => {
  const dispatch = useCtxDispatch();
  const { showError, showConfirm } = useMessages({ length: 4000 });
  const acceptFriendRequest = useAcceptFriendRequestMutation({
    update: (cache, { data }: FetchResult<any>) => {
      postMutationUpdateCache<PendingFriendRequestsQuery, User>({
        cache,
        query: { query: PendingFriendRequestsDocument },
        fieldName: 'pendingFriendRequests',
        type: 'remove',
        targetObj: data.acceptFriendRequest,
      });
      postMutationUpdateCache<FriendsQuery, User>({
        cache,
        query: {
          query: FriendsDocument,
          variables: { count: PAGE_COUNT, after: null },
        },
        fieldName: 'friends',
        isPaginated: true,
        type: 'unshift',
        targetObj: data.acceptFriendRequest,
      });
    },
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const { data, loading: loadingData } = usePendingFriendRequestsQuery();

  const pendingFriends = data ? data.pendingFriendRequests : [];

  const showBlockUserModal = (user: User) => {
    dispatch({
      type: 'SET_MODAL',
      modal: (
        <BlockUserModal
          user={user}
          update={(cache, { data }) => {
            postMutationUpdateCache<
              { pendingFriendRequests: Array<User> },
              User
            >({
              cache,
              query: { query: PendingFriendRequestsDocument },
              fieldName: 'pendingFriendRequests',
              type: 'remove',
              targetObj: data.blockUser,
            });
          }}
        />
      ),
    });
  };

  const onAccept = async (user: User) => {
    setLoading(true);
    try {
      acceptFriendRequest({ variables: { targetUserId: user.id } });
    } catch (e) {
      setLoading(false);
      return showError(e.message);
    }
    showConfirm(`${user.fullName} is now your friend`);
    setLoading(false);
  };

  let content;
  if (loadingData) {
    content = <Loader />;
  } else {
    if (pendingFriends.length) {
      const pendingCards = pendingFriends.map((user: User) => (
        <Card
          className="pending-friend-card"
          key={`pending-friend-${user.username}`}
        >
          <Card.Content>
            <ProfileImage
              profileImageUrl={user.profilePicture}
              width={50}
              height={50}
              style={{ float: 'right' }}
            />
            <Card.Header>{user.fullName}</Card.Header>
            <Card.Meta>{user.username}</Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <div className="ctas">
              <Button
                basic
                color="green"
                disabled={loading}
                onClick={() => onAccept(user)}
              >
                Accept Request
              </Button>
              <Button
                basic
                color="black"
                disabled={loading}
                onClick={() => showBlockUserModal(user)}
              >
                Block
              </Button>
            </div>
          </Card.Content>
        </Card>
      ));

      content = splitColumns(pendingCards, colCount);
    } else {
      content = (
        <div className="empty">No pending friend requests at this time.</div>
      );
    }
  }

  return (
    <div className="pending-friends">
      <Header as="h2">Pending Friend Requests</Header>
      {content}
      <style jsx>{`
        .pending-friends {
          padding: 30px;
        }
        .pending-friends :global(.pending-friend-card) {
          display: inline-block;
          margin: 15px;
        }
        .ctas {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
};

export default PendingFriends;

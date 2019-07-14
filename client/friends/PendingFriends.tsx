import * as React from 'react';
import { Card, Image, Button, Header } from 'semantic-ui-react';
import { User, PaginationResponse } from 'client/types';
import { useMutation, useQuery } from 'react-apollo-hooks';
import { ACCEPT_REQUEST_MUTATION } from 'client/graph/mutations';
import BlockUserModal from 'client/components/BlockUserModal';
import { useCtxDispatch } from 'client/components/ContextProvider';
import {
  PENDING_FRIEND_REQUESTS_QUERY,
  FRIENDS_QUERY,
} from 'client/graph/queries';
import Loader from 'client/components/Loader';
import { splitColumns } from 'client/lib/dom';
import { FetchResult } from 'react-apollo';
import { PAGE_COUNT } from './FriendItem';
import postMutationUpdateCache from 'client/lib/postMutationUpdateCache';

const PendingFriends = ({ colCount }: { colCount: number }) => {
  const dispatch = useCtxDispatch();
  const acceptFriendRequest = useMutation(ACCEPT_REQUEST_MUTATION, {
    update: (cache, { data }: FetchResult<any>) => {
      postMutationUpdateCache<{ pendingFriendRequests: Array<User> }, User>({
        cache,
        query: { query: PENDING_FRIEND_REQUESTS_QUERY },
        fieldName: 'pendingFriendRequests',
        type: 'remove',
        targetObj: data.acceptFriendRequest,
      });
      postMutationUpdateCache<{ friends: PaginationResponse<User> }, User>({
        cache,
        query: {
          query: FRIENDS_QUERY,
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

  const { data, loading: loadingData } = useQuery(
    PENDING_FRIEND_REQUESTS_QUERY,
  );

  const pendingFriends = data.pendingFriendRequests;

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
              query: { query: PENDING_FRIEND_REQUESTS_QUERY },
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
      throw e;
    }
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
            <Image floated="right" size="mini" />
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

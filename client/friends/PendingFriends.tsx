import * as React from 'react';
import { Card, Image, Button, Header, Loader } from 'semantic-ui-react';
import { User } from 'client/types';
import { useMutation, useQuery } from 'react-apollo-hooks';
import { ACCEPT_REQUEST_MUTATION } from 'client/graph/mutations';
import BlockUserModal from 'client/components/BlockUserModal';
import { useCtxDispatch } from 'client/components/ContextProvider';
import { PENDING_FRIEND_REQUESTS_QUERY } from 'client/graph/queries';

const PendingFriends = () => {
  const dispatch = useCtxDispatch();
  const acceptFriendRequest = useMutation(ACCEPT_REQUEST_MUTATION);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { data, loading: loadingData } = useQuery(
    PENDING_FRIEND_REQUESTS_QUERY,
  );

  const pendingFriends = data.pendingFriendRequests;
  console.log(data);

  const showBlockUserModal = (user: User) => {
    dispatch({
      type: 'SHOW_MODAL',
      modal: <BlockUserModal user={user} />,
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
    content = pendingFriends.length ? (
      pendingFriends.map((user: User) => (
        <Card key={`pending-friend-${user.username}`}>
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
      ))
    ) : (
      <div className="empty">No pending friend requests at this time.</div>
    );
  }

  return (
    <div className="pending-friends">
      <Header as="h2">Pending Friend Requests</Header>
      {content}
      <style jsx>{`
        .pending-friends {
          padding-top: 30px;
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

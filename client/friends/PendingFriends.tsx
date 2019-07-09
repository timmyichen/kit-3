import * as React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { User } from 'client/types';
import { useMutation } from 'react-apollo-hooks';
import { ACCEPT_REQUEST_MUTATION } from 'client/graph/mutations';
import BlockUserModal from 'client/components/BlockUserModal';
import { useCtxDispatch } from 'client/components/ContextProvider';

interface Props {
  pendingFriends: Array<User>;
}

const PendingFriends = (props: Props) => {
  const dispatch = useCtxDispatch();
  const acceptFriendRequest = useMutation(ACCEPT_REQUEST_MUTATION);
  const [loading, setLoading] = React.useState<boolean>(false);

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

  return (
    <div className="friends-page">
      {props.pendingFriends.map((user: User) => (
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
      ))}
      <style jsx>{`
        .friends-page {
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

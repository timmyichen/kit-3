import * as React from 'react';
import { UserSearch } from 'client/types';
import { Button, Card, Image } from 'semantic-ui-react';
import {
  useAcceptFriendRequestMutation,
  useRescindFriendRequestMutation,
  useUnblockUserMutation,
  useBlockUserMutation,
  useRemoveFriendMutation,
  useRequestFriendMutation,
} from 'generated/generated-types';
import useMessages from 'client/hooks/useMessages';
interface Props {
  user: UserSearch;
}

function SearchUserCard({ user }: Props) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { showError, showConfirm } = useMessages({ length: 4000 });

  const requestFriend = useRequestFriendMutation();
  const removeFriend = useRemoveFriendMutation();
  const blockUser = useBlockUserMutation();
  const unblockUser = useUnblockUserMutation();
  const rescindRequest = useRescindFriendRequestMutation();
  const acceptRequest = useAcceptFriendRequestMutation();

  const doAction = (action: () => void, successMessage: string) => async () => {
    setLoading(true);
    try {
      await action();
    } catch (e) {
      setLoading(false);
      return showError(e.message);
    }
    showConfirm(successMessage);
    setLoading(false);
  };

  const getCtas = (u: UserSearch) => {
    const variables = { targetUserId: u.id };

    if (u.isBlocked) {
      return (
        <Button
          basic
          color="black"
          onClick={doAction(
            () => unblockUser({ variables }),
            `Unblocked ${u.fullName}`,
          )}
        >
          Unblock
        </Button>
      );
    }

    let action: (o: Object) => void;
    let label = '';
    let successMessage;

    if (u.hasRequestedUser) {
      label = 'Accept Request';
      action = acceptRequest;
      successMessage = `Accepted ${u.fullName}`;
    } else if (u.isFriend) {
      label = 'Remove Friend';
      action = removeFriend;
      successMessage = `Removed ${u.fullName}`;
    } else if (u.isRequested) {
      label = 'Rescind Request';
      action = rescindRequest;
      successMessage = `Rescinded Request for ${u.fullName}`;
    } else {
      label = 'Add Friend';
      action = requestFriend;
      successMessage = `Requested ${u.fullName}`;
    }

    return (
      <>
        <Button
          disabled={loading}
          basic
          color="green"
          onClick={doAction(() => action({ variables }), successMessage)}
        >
          {label}
        </Button>
        <Button
          disabled={loading}
          basic
          color="black"
          onClick={doAction(
            () => blockUser({ variables }),
            `Blocked ${u.fullName}`,
          )}
        >
          Block
        </Button>
      </>
    );
  };

  return (
    <div className="user-card-item-wrapper">
      <Card key={`friend-search-${user.username}`} className="user-card-item">
        <Card.Content>
          <Image floated="right" size="mini" />
          <Card.Header>{user.fullName}</Card.Header>
          <Card.Meta>{user.username}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <div className="ctas">{getCtas(user)}</div>
        </Card.Content>
      </Card>
      <style jsx>{`
        .user-card-item-wrapper .ctas {
          display: flex;
          justify-content: space-between;
        }
        .user-card-item-wrapper {
          display: inline-block;
          margin: 15px;
        }
      `}</style>
    </div>
  );
}

export default SearchUserCard;

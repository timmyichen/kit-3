import * as React from 'react';
import { UserSearch } from 'client/types';
import { useMutation } from 'react-apollo-hooks';
import cloneDeep from 'lodash/cloneDeep';
import { Button, Card, Image } from 'semantic-ui-react';
import { SEARCH_USERS_QUERY } from 'client/graph/queries';
import {
  REQUEST_FRIEND_MUTATION,
  REMOVE_FRIEND_MUTATION,
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
  RESCIND_REQUEST_MUTATION,
  ACCEPT_REQUEST_MUTATION,
} from 'client/graph/mutations';
import { DataProxy } from 'apollo-cache';
import { FetchResult } from 'apollo-link';

interface Props {
  user: UserSearch;
}

function SearchUserCard({ user }: Props) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const requestFriend = useMutation(REQUEST_FRIEND_MUTATION, {
    update: createCacheUpdate({
      incomingDataField: 'requestFriend',
      updateFields: { isRequested: true },
    }),
  });

  const removeFriend = useMutation(REMOVE_FRIEND_MUTATION, {
    update: createCacheUpdate({
      incomingDataField: 'removeFriend',
      updateFields: { isFriend: false },
    }),
  });

  const blockUser = useMutation(BLOCK_USER_MUTATION, {
    update: createCacheUpdate({
      incomingDataField: 'blockUser',
      updateFields: {
        isFriend: false,
        isBlocked: true,
        isRequested: false,
        hasRequestedUser: false,
      },
    }),
  });

  const unblockUser = useMutation(UNBLOCK_USER_MUTATION, {
    update: createCacheUpdate({
      incomingDataField: 'unblockUser',
      updateFields: { isBlocked: false },
    }),
  });

  const rescindRequest = useMutation(RESCIND_REQUEST_MUTATION, {
    update: createCacheUpdate({
      incomingDataField: 'rescindFriendRequest',
      updateFields: { isRequested: false },
    }),
  });

  const acceptRequest = useMutation(ACCEPT_REQUEST_MUTATION, {
    update: createCacheUpdate({
      incomingDataField: 'acceptFriendRequest',
      updateFields: {
        isFriend: true,
        hasRequestedUser: false,
        isRequested: false,
      },
    }),
  });

  const doAction = (action: () => void) => async () => {
    setLoading(true);
    try {
      await action();
    } catch (e) {
      setLoading(false);
      throw e;
    }
    setLoading(false);
  };

  const getCtas = (u: UserSearch) => {
    const variables = { targetUserId: u.id };

    if (u.isBlocked) {
      return (
        <Button
          basic
          color="black"
          onClick={doAction(() => unblockUser({ variables }))}
        >
          Unblock
        </Button>
      );
    }

    let action: (o: Object) => void;
    let label = '';

    if (u.hasRequestedUser) {
      label = 'Accept Request';
      action = acceptRequest;
    } else if (u.isFriend) {
      label = 'Remove Friend';
      action = removeFriend;
    } else if (u.isRequested) {
      label = 'Rescind Request';
      action = rescindRequest;
    } else {
      label = 'Add Friend';
      action = requestFriend;
    }

    return (
      <>
        <Button
          disabled={loading}
          basic
          color="green"
          onClick={doAction(() => action({ variables }))}
        >
          {label}
        </Button>
        <Button
          disabled={loading}
          basic
          color="black"
          onClick={doAction(() => blockUser({ variables }))}
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

const query = { query: SEARCH_USERS_QUERY, variables: { searchQuery: '' } };

type RelationField =
  | 'isFriend'
  | 'isRequested'
  | 'hasRequestedUser'
  | 'isBlocked';

interface CreateCacheUpdateProps {
  incomingDataField: string;
  updateFields: {
    [k in RelationField]?: any;
  };
}

const createCacheUpdate = ({
  incomingDataField,
  updateFields,
}: CreateCacheUpdateProps) => (
  cache: DataProxy,
  { data }: FetchResult<any>,
) => {
  const q: { searchUsers: Array<UserSearch> } | null = cache.readQuery(query);
  if (!q) {
    return;
  }

  console.log(data);

  const updateIndex = q.searchUsers.findIndex(
    u => u.id === data[incomingDataField].id,
  );
  const searchUsers = cloneDeep(q.searchUsers);

  for (const key of Object.keys(updateFields)) {
    const k = key as RelationField;
    searchUsers[updateIndex][k] = updateFields[k];
  }

  console.log(searchUsers);

  cache.writeQuery({ ...query, data: { searchUsers } });
};

export default SearchUserCard;

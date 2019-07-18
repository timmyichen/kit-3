import * as React from 'react';
import { UserSearch } from 'client/types';
import { useMutation } from 'react-apollo-hooks';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';
import { Button, Card, Image } from 'semantic-ui-react';
import {
  REQUEST_FRIEND_MUTATION,
  REMOVE_FRIEND_MUTATION,
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
  RESCIND_REQUEST_MUTATION,
  ACCEPT_REQUEST_MUTATION,
} from 'client/graph/mutations';
import { DataProxy } from 'apollo-cache';
import { FetchResult, DocumentNode } from 'apollo-link';
import { SearchUsersDocument } from 'generated/generated-types';

const searchQuery = {
  query: SearchUsersDocument,
  name: 'searchUsers',
  variables: { searchQuery: '' },
};
interface Props {
  user: UserSearch;
}

function SearchUserCard({ user }: Props) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const requestFriend = useMutation(REQUEST_FRIEND_MUTATION, {
    update: createCacheUpdate({
      query: searchQuery,
      incomingDataField: 'requestFriend',
      updateFields: { isRequested: true },
    }),
  });

  const removeFriend = useMutation(REMOVE_FRIEND_MUTATION, {
    update: createCacheUpdate({
      query: searchQuery,
      incomingDataField: 'removeFriend',
      updateFields: { isFriend: false },
    }),
  });

  const blockUser = useMutation(BLOCK_USER_MUTATION, {
    update: createCacheUpdate({
      query: searchQuery,
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
      query: searchQuery,
      incomingDataField: 'unblockUser',
      updateFields: { isBlocked: false },
    }),
  });

  const rescindRequest = useMutation(RESCIND_REQUEST_MUTATION, {
    update: createCacheUpdate({
      query: searchQuery,
      incomingDataField: 'rescindFriendRequest',
      updateFields: { isRequested: false },
    }),
  });

  const acceptRequest = useMutation(ACCEPT_REQUEST_MUTATION, {
    update: createCacheUpdate({
      query: searchQuery,
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

type RelationField =
  | 'isFriend'
  | 'isRequested'
  | 'hasRequestedUser'
  | 'isBlocked';

interface CreateCacheUpdateProps {
  incomingDataField: string;
  query: {
    query: DocumentNode;
    name: string;
    variables: any;
  };
  updateFields: {
    [k in RelationField]?: any;
  };
}

const createCacheUpdate = ({
  incomingDataField,
  updateFields,
  query,
}: CreateCacheUpdateProps) => (
  cache: DataProxy,
  { data }: FetchResult<any>,
) => {
  const q: { [s: string]: Array<UserSearch> } | null = cache.readQuery(
    omit(query, ['name']),
  );
  if (!q) {
    return;
  }

  const updateIndex = q[query.name].findIndex(
    u => u.id === data[incomingDataField].id,
  );
  const copy = cloneDeep(q[query.name]);

  for (const key of Object.keys(updateFields)) {
    const k = key as RelationField;
    copy[updateIndex][k] = updateFields[k];
  }

  cache.writeQuery({ ...query, data: { [query.name]: copy } });
};

export default SearchUserCard;

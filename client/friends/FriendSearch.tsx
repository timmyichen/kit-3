import * as React from 'react';
import debounce from 'lodash/debounce';
import { useApolloClient, useMutation } from 'react-apollo-hooks';
import { Input, Card, Image, Button, Header } from 'semantic-ui-react';
import { SEARCH_USERS_QUERY } from 'client/graph/queries';
import {
  REQUEST_FRIEND_MUTATION,
  REMOVE_FRIEND_MUTATION,
  BLOCK_USER_MUTATION,
  UNBLOCK_USER_MUTATION,
  RESCIND_REQUEST_MUTATION,
  ACCEPT_REQUEST_MUTATION,
} from 'client/graph/mutations';
import { UserSearch } from 'client/types';

const FriendSearch = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [results, setResults] = React.useState<Array<UserSearch>>([]);
  const [query, setQuery] = React.useState<string>('');

  const client = useApolloClient();

  const search = debounce(async (value: string) => {
    const res = await client.query({
      query: SEARCH_USERS_QUERY,
      variables: { searchQuery: value },
    });
    setLoading(false);
    if (res.data && res.data.searchUsers) {
      setResults(res.data.searchUsers);
    }
  }, 500);

  const requestFriend = useMutation(REQUEST_FRIEND_MUTATION);
  const removeFriend = useMutation(REMOVE_FRIEND_MUTATION);
  const blockUser = useMutation(BLOCK_USER_MUTATION);
  const unblockUser = useMutation(UNBLOCK_USER_MUTATION);
  const rescindRequest = useMutation(RESCIND_REQUEST_MUTATION);
  const acceptRequest = useMutation(ACCEPT_REQUEST_MUTATION);

  const getCtas = (u: UserSearch) => {
    const variables = { targetUserId: u.id };

    if (u.isBlocked) {
      return (
        <Button basic color="black" onClick={() => unblockUser({ variables })}>
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

    return [
      <Button basic color="green" onClick={() => action({ variables })}>
        {label}
      </Button>,
      <Button basic color="black" onClick={() => blockUser({ variables })}>
        Block
      </Button>,
    ];
  };

  return (
    <div className="friend-search-page">
      <Header as="h2">Find Friends</Header>
      <Input
        loading={loading}
        value={query}
        onChange={(_, { value }) => {
          setLoading(true);
          setQuery(value);
          search(value);
        }}
      />
      <div className="search-results">
        {results.map((result: UserSearch) => (
          <Card key={`friend-search-${result.username}`}>
            <Card.Content>
              <Image floated="right" size="mini" />
              <Card.Header>{result.fullName}</Card.Header>
              <Card.Meta>{result.username}</Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <div className="ctas">{getCtas(result)}</div>
            </Card.Content>
          </Card>
        ))}
      </div>
      <style jsx>{`
        .ctas {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
};

export default FriendSearch;

import * as React from 'react';
import debounce from 'lodash/debounce';
import { useApolloClient } from 'react-apollo-hooks';
import { Search } from 'semantic-ui-react';
import { searchUsers as searchUsersQuery } from 'client/graph/queries';
import { User } from 'client/types';

const FriendsPage = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [results, setResults] = React.useState<Array<any>>([]);
  const [query, setQuery] = React.useState<string>('');

  const client = useApolloClient();

  const search = debounce(async (value: string) => {
    const res = await client.query({
      query: searchUsersQuery,
      variables: { searchQuery: value, excludeFriends: true },
    });
    setLoading(false);
    if (res.data && res.data.searchUsers) {
      setResults(
        res.data.searchUsers.map((u: User) => ({
          title: `${u.username} (${u.fullName})`,
        })),
      );
    }
  }, 1000);

  return (
    <div className="profile-page-wrapper">
      <Search
        loading={loading}
        onSearchChange={(_, { value }: { value?: any }) => {
          setLoading(true);
          setQuery(value);
          search(value);
        }}
        results={results}
        value={query}
      />
    </div>
  );
};

export default FriendsPage;

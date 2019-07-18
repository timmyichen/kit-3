import * as React from 'react';
import debounce from 'lodash/debounce';
import { Input, Header } from 'semantic-ui-react';

import { UserSearch } from 'client/types';
import { isBrowser, splitColumns } from 'client/lib/dom';
import useWindowSize from 'client/hooks/useWindowSize';
import Loader from 'client/components/Loader';
import SearchUserCard from './SearchUserCard';
import { useSearchUsersQuery } from 'generated/generated-types';

const FriendSearch = () => {
  const [colCount, setColCount] = React.useState<number>(3);

  const {
    data,
    loading: loadingSearch,
    fetchMore: searchFetchMore,
  } = useSearchUsersQuery({ variables: { searchQuery: '' } });

  const results = (data && data.searchUsers) || [];

  if (isBrowser) {
    const size = useWindowSize();
    React.useEffect(() => {
      const cols = size && size.width ? Math.floor(size.width / 350) : 3;
      setColCount(cols || 1);
    }, [size.width]);
  }

  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<string>('');

  React.useEffect(() => {
    setLoading(loadingSearch);
  }, [loadingSearch]);

  const doSearch = debounce(async (value: string) => {
    await searchFetchMore({
      variables: { searchQuery: value },
      updateQuery: (_, { fetchMoreResult }) =>
        fetchMoreResult ? fetchMoreResult : { searchUsers: [] },
    });
    setLoading(false);
  }, 400);

  let content;
  if (loading) {
    content = <Loader />;
  } else if (results.length) {
    const userCards = results.map((result: UserSearch) => (
      <SearchUserCard key={`search-user-card-${result.id}`} user={result} />
    ));

    content = splitColumns(userCards, colCount);
  } else if (query) {
    content = <Header as="h3">No results found</Header>;
  }

  return (
    <div className="friend-search-page">
      <Header as="h2">Find Friends</Header>
      <Input
        value={query}
        onChange={(_, { value }) => {
          setLoading(true);
          setQuery(value);
          doSearch(value);
        }}
      />
      <div className="content">{query && content}</div>
      <style jsx>{`
        .friend-search-page {
          padding: 30px;
        }
        .search-results {
          margin-top: 30px;
        }
      `}</style>
    </div>
  );
};

export default FriendSearch;

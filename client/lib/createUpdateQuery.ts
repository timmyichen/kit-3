export default (queryName: string) => (prev: any, { fetchMoreResult }: any) => {
  if (!fetchMoreResult) return prev;
  return {
    ...prev,
    [queryName]: {
      ...prev[queryName],
      items: [...prev[queryName].items, ...fetchMoreResult[queryName].items],
      pageInfo: fetchMoreResult[queryName].pageInfo,
    },
  };
};

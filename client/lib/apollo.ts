import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-fetch';

const client = new ApolloClient({
  link: new HttpLink({
    uri: '/graphql',
    fetch,
  }),
  cache: new InMemoryCache(),
});

export default client;

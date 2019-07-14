import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import fetch from 'isomorphic-fetch';
const introspectionQueryResultData = require('../../generated-gql/graphql.schema.json');

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export const dataIdFromObject = (o: any) => `${o.__typename}:${o.id}`;

const client = new ApolloClient({
  link: new HttpLink({
    uri: '/graphql',
    fetch,
  }),
  cache: new InMemoryCache({
    fragmentMatcher,
    dataIdFromObject,
  }),
});

export default client;

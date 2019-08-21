import { ApolloClient } from 'apollo-client';
// @ts-ignore TODO: type this
import { createUploadLink } from 'apollo-upload-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import fetch from 'isomorphic-fetch';
const introspectionQueryResultData = require('../../generated-gql/graphql.schema.json');

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const client = new ApolloClient({
  link: new createUploadLink({
    uri: '/graphql',
    fetch,
  }),
  cache: new InMemoryCache({
    fragmentMatcher,
  }),
});

export default client;

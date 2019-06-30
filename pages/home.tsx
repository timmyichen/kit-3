import * as React from 'react';
import * as gqlTag from 'graphql-tag';
import { Query } from 'react-apollo';

const query = gqlTag`query currentUser {
  currentUser {
    email
    name
  }
}`;

export default () => (
  <Query query={query}>
    {data => {
      // console.log(data);
      return <h1>i home!</h1>;
    }}
  </Query>
);

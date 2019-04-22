import { GraphQLSchema, GraphQLObjectType } from 'graphql';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueries',
    description: 'Top level queries',
    fields: () => ({}),
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutations',
    description: 'Top level mutations',
    fields: () => ({}),
  }),
});

export default schema;

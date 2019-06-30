import { GraphQLSchema } from 'graphql';
import query from './queries';
import mutation from './mutations';

const schema = new GraphQLSchema({
  query,
  // @ts-ignore wtf https://github.com/Microsoft/TypeScript/issues/15534
  mutation,
});

export default schema;

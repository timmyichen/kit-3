import { GraphQLSchema } from 'graphql';
import query from './queries';
import mutation from './mutations';

const schema = new GraphQLSchema({
  // @ts-ignore wtf https://github.com/Microsoft/TypeScript/issues/15534
  query,
  // @ts-ignore wtf same^
  mutation,
});

export default schema;

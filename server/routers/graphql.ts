import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import schema from 'server/graph';

const router = express.Router();

router.get(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

router.post(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: false,
  }),
);

export default router;

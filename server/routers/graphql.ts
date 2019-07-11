import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import schema from 'server/graph';
import { loader } from 'server/lib/loader';

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
    context: {
      loader: loader(),
    },
    graphiql: false,
  }),
);

export default router;

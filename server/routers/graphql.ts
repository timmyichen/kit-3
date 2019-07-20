import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import schema from 'server/graph';
import { loader } from 'server/lib/loader';
import { responseHijack } from 'server/middleware/responseHijack';

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
  responseHijack,
  graphqlHTTP(({ user }) => ({
    schema,
    context: {
      user,
      loader: loader(),
    },
    graphiql: false,
  })),
);

export default router;

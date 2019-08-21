import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import schema from 'server/graph';
import { loader } from 'server/lib/loader';
import { responseHijack } from 'server/middleware/responseHijack';
import { graphqlUploadExpress } from 'graphql-upload';

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
  graphqlUploadExpress({ maxFileSize: 1 * 1024 * 1024, maxFiles: 1 }),
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

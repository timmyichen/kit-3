import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import schema from 'server/graph';
import { loader } from 'server/lib/loader';
import { responseHijack } from 'server/middleware/responseHijack';
import { graphqlUploadExpress } from 'graphql-upload';
import { ReqWithRedis, CustomRedisClient } from 'server/lib/redis';
import { Users } from 'server/models';

const router = express.Router();

export interface GraphQLContext extends express.Request {
  user: Users | null;
  loader: ReturnType<typeof loader>;
  redis: CustomRedisClient;
}

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
  graphqlHTTP((req: ReqWithRedis) => ({
    schema,
    context: {
      ...req,
      loader: loader(),
    },
    graphiql: false,
  })),
);

export default router;

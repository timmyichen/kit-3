declare namespace Express {
  interface IRoute {
    getAsync: express.IRouterMatcher<this>;
    postAsync: express.IRouterMatcher<this>;
  }
}

declare module 'express-router-async' {
  import * as express from 'express';

  const router = express.IRouter;

  export = router;
}

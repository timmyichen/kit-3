import * as express from 'express';
import * as morgan from 'morgan';
import nextjs from './lib/next';
import PagesRouter from './routers/pages';
import GraphqlRouter from './routers/graphql';

const app: express.Application = express();

nextjs.nextApp.prepare().then(() => {
  const port = process.env.SERVER_PORT || 8080;

  app.use(morgan(':method :url :status'));

  app.use(PagesRouter);
  app.use(GraphqlRouter);

  app.get('*', (req, res) => {
    nextjs.handle(req, res);
  });

  app.listen(port, function() {
    console.log(`started on port ${port}`);
  });
});

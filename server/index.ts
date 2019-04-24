require('dotenv').config();
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import nextjs from './lib/next';
import PagesRouter from './routers/pages';
import GraphqlRouter from './routers/graphql';
import { User } from './models';

const app: express.Application = express();

if (!process.env.MONGO_URL) {
  throw new Error('Expected mongo url');
}

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

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

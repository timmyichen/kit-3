import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as mongo from 'connect-mongo';
import nextjs from './lib/next';
import PagesRouter from './routers/pages';
import GraphqlRouter from './routers/graphql';
import auth from './routers/auth';
// import { User } from './models';

dotenv.config();
const MongoStore = mongo(session);

if (!process.env.SESSION_SECRET || !process.env.MONGO_URL) {
  throw new Error('expected env var');
}

const sessionSecret: string = process.env.SESSION_SECRET;
const mongoUrl: string =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URL
    : 'mongodb://mongo:27017/ydb';

const app: express.Application = express();

nextjs.nextApp.prepare().then(async () => {
  mongoose.connect(mongoUrl, { useNewUrlParser: true });
  console.log('connected to db'); // tslint:disable-line no-console

  const port = process.env.SERVER_PORT || 8000;

  app.use(
    morgan(':method :url :status', {
      skip: (req: express.Request) => req.url.startsWith('/_next/'),
    }),
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    session({
      resave: true,
      saveUninitialized: true,
      secret: sessionSecret,
      store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true,
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(PagesRouter);
  app.use(GraphqlRouter);
  app.use(auth());

  app.get('*', (req, res) => {
    nextjs.handle(req, res);
  });

  app.listen(port, () => {
    console.log(`started on port ${port}`); // tslint:disable-line no-console
  });
});

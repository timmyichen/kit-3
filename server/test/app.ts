import { db } from 'server/lib/db';
import { Sequelize } from 'sequelize-typescript';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as request from 'supertest';
import * as connectSessionSequelize from 'connect-session-sequelize';
import GraphqlRouter from 'server/routers/graphql';
import { Server } from 'http';
import { Users } from 'server/models';
import * as getPort from 'get-port';

class App {
  db: Sequelize;
  server: express.Application;
  _server: Server;
  authedUser: Users | null = null;

  constructor() {
    this.db = db;
  }

  async initialize() {
    try {
      await this.db.authenticate();
    } catch (e) {
      throw e;
    }

    const SequelizeStore = connectSessionSequelize(session.Store);
    const store = new SequelizeStore({ db });

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use((req, _, next) => {
      if (this.authedUser) {
        req.user = this.authedUser;
      }

      next();
    });

    app.use(GraphqlRouter);

    store.sync();

    const server = app.listen(
      await getPort({ port: getPort.makeRange(9000, 10000) }),
    );

    this.server = app;
    this._server = server;
  }

  async destroy() {
    this._server.close();
    try {
      await this.db.connectionManager.close();
    } catch (e) {
      throw e;
    }
  }

  login(user: Users) {
    this.authedUser = user;
  }

  logout() {
    this.authedUser = null;
  }

  async graphQL({ query, variables }: { query: string; variables?: Object }) {
    try {
      return await request(this.server)
        .post('/graphql')
        .send({
          query,
          variables,
        });
    } catch (e) {
      throw e;
    }
  }
}

export default App;

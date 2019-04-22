import * as express from 'express';
import * as next from "next";

const isDev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev: isDev });
const handle = nextApp.getRequestHandler();

const nextjs = {
  nextApp,
  handle,
  render: (req: express.Request, res: express.Response, page: string) => nextApp.render(req, res, page),
};

export default nextjs;

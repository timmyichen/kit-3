import * as express from 'express';
import * as asyncRouter from 'express-router-async';
import nextjs from '../lib/next';

const router = asyncRouter();

router.get('/', (req: express.Request, res: express.Response) => {
  nextjs.render(req, res, '/');
});

router.getAsync('/home', async (req: express.Request, res: express.Response) => {
  nextjs.render(req, res, '/home');
});

export default router;

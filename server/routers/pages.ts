import * as express from 'express';
import * as asyncRouter from 'express-router-async';
import nextjs from 'server/lib/next';

const router = asyncRouter();

router.get('/', (req: express.Request, res: express.Response) => {
  nextjs.render(req, res, '/');
});

router.get('/login', (req: express.Request, res: express.Response) => {
  nextjs.render(req, res, '/login');
});

router.getAsync(
  '/home',
  async (req: express.Request, res: express.Response) => {
    nextjs.render(req, res, '/home');
  },
);

export default router;

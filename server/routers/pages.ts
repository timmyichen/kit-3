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
  '/dashboard',
  async (req: express.Request, res: express.Response) => {
    if (!req.user) {
      res.redirect('/login');
      return;
    }
    nextjs.render(req, res, '/dashboard');
  },
);

router.getAsync(
  '/account',
  async (req: express.Request, res: express.Response) => {
    if (!req.user) {
      res.redirect('/login');
      return;
    }
    nextjs.render(req, res, '/account');
  },
);

router.getAsync(
  ['/friends', '/friends/:slug'],
  async (req: express.Request, res: express.Response) => {
    if (!req.user) {
      res.redirect('/login');
      return;
    }
    nextjs.render(req, res, '/friends', req.params);
  },
);

router.getAsync(
  ['/deets', '/deets/:slug'],
  async (req: express.Request, res: express.Response) => {
    if (!req.user) {
      res.redirect('/login');
      return;
    }
    nextjs.render(req, res, '/deets', req.params);
  },
);

export default router;

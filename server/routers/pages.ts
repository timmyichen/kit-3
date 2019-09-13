import * as express from 'express';
import * as asyncRouter from 'express-router-async';
import nextjs from 'server/lib/next';
import { requireUser, requireGuest } from 'server/middleware/auth';

const router = asyncRouter();

const pages = ['about', 'contact', 'terms', 'privacy'];

router.get('/', (req: express.Request, res: express.Response) => {
  nextjs.render(req, res, '/');
});

pages.forEach(page => {
  router.get(`/${page}`, (req: express.Request, res: express.Response) => {
    nextjs.render(req, res, `/${page}`);
  });
});

router.get(
  '/login',
  requireGuest,
  (req: express.Request, res: express.Response) => {
    nextjs.render(req, res, '/login', req.query);
  },
);

router.get(
  '/signup',
  requireGuest,
  (req: express.Request, res: express.Response) => {
    nextjs.render(req, res, '/signup', req.query);
  },
);

router.get(
  '/forgot-password',
  requireGuest,
  (req: express.Request, res: express.Response) => {
    nextjs.render(req, res, '/forgotPassword', req.query);
  },
);

router.get(
  '/set-password',
  requireGuest,
  (req: express.Request, res: express.Response) => {
    nextjs.render(req, res, '/setPassword', req.query);
  },
);

router.getAsync(
  '/dashboard',
  requireUser,
  async (req: express.Request, res: express.Response) => {
    nextjs.render(req, res, '/dashboard', req.query);
  },
);

router.getAsync(
  '/account/verify',
  requireUser,
  async (req: express.Request, res: express.Response) => {
    nextjs.render(req, res, '/account/verify', req.query);
  },
);

router.getAsync(
  '/account',
  requireUser,
  async (req: express.Request, res: express.Response) => {
    nextjs.render(req, res, '/account', req.query);
  },
);

router.getAsync(
  ['/friends', '/friends/:slug'],
  requireUser,
  async (req: express.Request, res: express.Response) => {
    nextjs.render(req, res, '/friends', {
      ...req.params,
      ...req.query,
    });
  },
);

router.getAsync(
  ['/deets', '/deets/:slug'],
  requireUser,
  async (req: express.Request, res: express.Response) => {
    nextjs.render(req, res, '/deets', {
      ...req.params,
      ...req.query,
    });
  },
);

router.getAsync(
  '/friend/:username',
  requireUser,
  async (req: express.Request, res: express.Response) => {
    const { username } = req.params;

    if (!username) {
      return res.status(404).send();
    }

    nextjs.render(req, res, '/friend', {
      ...req.query,
      username,
    });
  },
);

export default router;

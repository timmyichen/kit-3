import * as express from 'express';
import * as asyncRouter from 'express-router-async';
import nextjs from 'server/lib/next';

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

router.getAsync(
  '/friend/:username',
  async (req: express.Request, res: express.Response) => {
    if (!req.user) {
      res.redirect('/login');
      return;
    }

    const { username } = req.params;

    if (!username) {
      return res.status(404).send();
    }

    nextjs.render(req, res, '/friend', { username });
  },
);

export default router;

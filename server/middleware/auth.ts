import * as express from 'express';

export async function requireUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (req.user) {
    next();
  } else {
    res.redirect(`/login?goto=${req.originalUrl}`);
  }
}

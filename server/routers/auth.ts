import * as express from 'express';
import * as bluebird from 'bluebird';
import * as asyncRouter from 'express-router-async';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import { Users } from '../models';
const bcrypt = bluebird.promisifyAll(require('bcrypt-nodejs'));

function init() {
  const LocalStrategy = passportLocal.Strategy;

  passport.use(
    'local-login',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      Users.findOne({
        where: {
          email: email.toLowerCase(),
        },
      })
        .then((user: any) => {
          if (!user) {
            return done(undefined, false, { message: 'Login failed' });
          }

          bcrypt
            .compareAsync(password, user.password)
            .then((isValid: boolean) => {
              if (!isValid) {
                return done(undefined, false, { message: 'Login failed' });
              }

              return done(undefined, user);
            })
            .catch((e: any) => {
              done(e);
            });
        })
        .catch((e: any) => {
          done(e);
        });
    }),
  );

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      (req: express.Request, email: string, password: string, done: any) => {
        const { givenName, familyName, username, birthday } = req.body;

        if (!email || !password || !username || !givenName) {
          return done(null, false, { message: 'missing required field' });
        }

        bcrypt
          .genSaltAsync(10)
          .then((salt: string) => {
            return bcrypt.hashAsync(password, salt, null);
          })
          .then((hash: string) => {
            return Users.create({
              givenName,
              familyName,
              username,
              birthday,
              email,
              password: hash,
            });
          })
          .then((user: any) => {
            return done(null, user);
          })
          .catch((e: any) => {
            if (e.name === 'ValidationError') {
              return done(null, false, {
                message: 'A user with that email exists.',
              });
            }

            done(e);
          });
      },
    ),
  );

  passport.serializeUser<any, any>((user, cb) => {
    cb(undefined, user._id);
  });

  passport.deserializeUser((id: number, done) => {
    Users.findOne({ where: { id } })
      .then((user: any) => {
        done(null, user);
      })
      .catch((err: Error) => {
        return done(err);
      });
  });

  const router = asyncRouter();

  router.post(
    '/login',
    passport.authenticate('local-login', {
      session: true,
      failureRedirect: '/ohno',
    }),
    (_: any, res: express.Response) => {
      return res.redirect('/home');
    },
  );

  router.post(
    '/signup',
    passport.authenticate('local-signup', {
      session: true,
      failureRedirect: '/ohno',
    }),
    (req: express.Request, res: express.Response) => {
      req.login(req.user, err => {
        if (err) {
          return res.status(500).send('Unknown error in auth');
        }

        return res.redirect('/home');
      });
    },
  );

  router.get('/logout', (req: express.Request, res: express.Response) => {
    req.logout();
    res.redirect('/');
  });

  router.get(
    '/data/user_info',
    (req: express.Request, res: express.Response) => {
      res.json(req.user);
    },
  );

  return router;
}

export default init;

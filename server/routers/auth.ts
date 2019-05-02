import * as express from 'express';
import * as bluebird from 'bluebird';
import * as asyncRouter from 'express-router-async';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import { User } from '../models';
import { UserType } from '../models/types';

const bcrypt = bluebird.promisifyAll(require('bcrypt-nodejs'));

function init() {
  const LocalStrategy = passportLocal.Strategy;

  passport.use(
    'local-login',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: email.toLowerCase() })
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
        const { name } = req.body;

        if (!email || !password || !name) {
          return done(null, false, { message: 'missing required field' });
        }

        bcrypt
          .genSaltAsync(10)
          .then((salt: string) => {
            return bcrypt.hashAsync(password, salt, null);
          })
          .then((hash: string) => {
            const user = new User({
              name,
              email,
              password: hash,
            });

            return user.save();
          })
          .then((user: UserType) => {
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

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user: any) => {
      if (err) {
        return done(err);
      }

      done(null, user);
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

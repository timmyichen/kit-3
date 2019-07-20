// this file pulled from https://github.com/graphql/express-graphql/issues/427

import { NextFunction, Request, Response } from 'express';
import hijackResponse = require('hijackresponse');

// Extend Express Response with hijack specific function
interface IHijackedResponse extends Response {
  unhijack: () => void;
}

/**
 * Stupid problems sometimes require stupid solutions.
 * Unfortunately `express-graphql` has hardcoded 4xx/5xx http status codes in certain error scenarios.
 * In addition they also finalize the response, so no other middleware shall prevail in their wake.
 *
 * It's best practice to always return 200 in GraphQL APIs and specify the error in the response,
 * as otherwise clients might choke on the response or unnecessarily retry stuff.
 * Also monitoring is improved by only throwing 5xx responses on unexpected server errors.
 *
 * This middleware will hijack the `res.send` method which gives us one last chance to modify
 * the response and normalize the response status codes.
 *
 * The only alternative to this would be to either fork or ditch `express-graphql`. ;-)
 */
export const responseHijack = (
  _: Request,
  originalRes: Response,
  next: NextFunction,
) => {
  hijackResponse(originalRes, (err: Error, res: IHijackedResponse) => {
    // In case we encounter a "real" non GraphQL server error we keep it untouched and move on.
    if (err) {
      res.unhijack();
      return next(err);
    }

    // We like our status code simple in GraphQL land
    // e.g. Apollo clients will retry on 5xx despite potentially not necessary.
    res.statusCode = 200;
    res.pipe(res);
  });
  // next() must be called explicitly, even when hijacking the response:
  next();
};

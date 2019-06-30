import * as express from 'express';
import userType from 'server/graph/types/userType';

export default {
  description: 'The currently authed user',
  type: userType,
  resolve(_1: any, _2: any, { user }: express.Request) {
    return user || null;
  },
};

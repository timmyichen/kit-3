import * as express from 'express';
import * as bluebird from 'bluebird';
import validator from 'validator';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { Users } from 'server/models';
import userType from '../types/userType';
const bcrypt = bluebird.promisifyAll(require('bcrypt-nodejs'));

interface Args {
  passwordVerification: string;
  email: string;
  givenName: string;
  familyName: string;
  birthday?: string;
}

export default {
  description: 'Unblock a user',
  type: new GraphQLNonNull(userType),
  args: {
    passwordVerification: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    givenName: { type: new GraphQLNonNull(GraphQLString) },
    familyName: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: GraphQLString },
  },
  async resolve(_: any, args: Args, req: express.Request) {
    if (!req.user) {
      throw new AuthenticationError('Must be logged in');
    }

    const user: Users | null = await Users.findByPk(req.user.id);

    if (!user) {
      throw new AuthenticationError(
        'Something must have really gone wrong but this is only here to appease TS',
      );
    }

    const isValid = await bcrypt.compareAsync(
      args.passwordVerification,
      user.password,
    );

    if (!isValid) {
      throw new UserInputError('Password verification failed');
    }

    const { email, givenName, familyName } = args;

    let birthdayDate;
    let birthdayYear;
    if (args.birthday) {
      const date = validator.toDate(args.birthday);
      if (!date || validator.isAfter(args.birthday)) {
        throw new UserInputError('Invalid birthday date');
      }
      birthdayYear = date.getFullYear();
      birthdayDate = date;
      birthdayDate.setFullYear(1234);
    }

    await user.update({
      email,
      given_name: givenName,
      family_name: familyName,
      birthday_date: birthdayDate,
      birthday_year: birthdayYear,
    });

    return user;
  },
};

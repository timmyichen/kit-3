import * as bluebird from 'bluebird';
import validator from 'validator';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { Users } from 'server/models';
import userType from '../types/userType';
import { GraphQLContext } from 'server/routers/graphql';
const bcrypt = bluebird.promisifyAll(require('bcrypt-nodejs'));

interface Args {
  passwordVerification: string;
  email: string;
  givenName: string;
  familyName: string;
  birthday?: string;
}

export default {
  description: 'Update the currently authed user',
  type: new GraphQLNonNull(userType),
  args: {
    passwordVerification: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    givenName: { type: new GraphQLNonNull(GraphQLString) },
    familyName: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: GraphQLString },
  },
  async resolve(_: any, args: Args, req: GraphQLContext) {
    if (!req.user) {
      throw new AuthenticationError('Must be logged in');
    }

    let user: Users | null = await Users.findByPk(req.user.id);

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

    if (args.givenName.trim().length === 0) {
      throw new UserInputError('Your given name is required');
    }

    const { email, givenName, familyName } = args;

    let birthdayDate = null;
    let birthdayYear = null;
    if (args.birthday) {
      if (!validator.toDate(args.birthday)) {
        throw new UserInputError('Invalid birthday date');
      }
      const [year, month, day] = args.birthday
        .split('-')
        .map(s => parseInt(s, 10));

      // months are zero indexed
      const date = new Date(Date.UTC(year, month - 1, day));
      birthdayYear = date.getFullYear();
      birthdayDate = date;
      birthdayDate.setFullYear(1234);
    }

    user = await user.update({
      email,
      given_name: givenName,
      family_name: familyName,
      birthday_date: birthdayDate,
      birthday_year: birthdayYear,
    });

    return user;
  },
};

import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import userFields from './userFields';
import { ApolloError } from 'apollo-server';

export default new GraphQLObjectType({
  name: 'BirthdayUser',
  description: 'A user of the platform',
  fields: () => ({
    ...userFields,
    birthday: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user: any) => {
        if (!user.birthday_date || !user.birthday_year) {
          throw new ApolloError('no birthday found');
        }

        const birthday = new Date(user.birthday_date);
        return [
          user.birthday_year,
          birthday.getMonth() + 1,
          birthday.getDate() + 1,
        ].join('-');
      },
    },
  }),
});

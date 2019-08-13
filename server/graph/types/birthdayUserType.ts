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

        const [, month, date] = user.birthday_date.split('-');
        return [user.birthday_year, month, date].join('-');
      },
    },
  }),
});

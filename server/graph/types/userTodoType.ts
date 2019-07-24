import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { Users, Deets, Friendships } from 'server/models';

export default new GraphQLObjectType({
  name: 'UserTodos',
  description: 'A phone number deet',
  fields: () => ({
    hasFriends: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async (user: Users, _, { loader }) => {
        return !!(await loader(Friendships).loadBy('first_user', user.id));
      },
    },
    hasDeets: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async (user: Users, _, { loader }) => {
        if (!user) {
          return false;
        }

        return !!(await loader(Deets).loadBy('owner_id', user.id));
      },
    },
    hasPrimaryAddress: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async (user: Users, _, { loader }) => {
        if (!user) {
          return false;
        }

        return !!(await loader(Deets).loadBy('owner_id', user.id, {
          type: 'address',
          is_primary: true,
        }));
      },
    },
    hasPrimaryPhoneNumber: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async (user: Users, _, { loader }) => {
        if (!user) {
          return false;
        }

        return !!(await loader(Deets).loadBy('owner_id', user.id, {
          type: 'phone_number',
          is_primary: true,
        }));
      },
    },
    hasPrimaryEmailAddress: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async (user: Users, _, { loader }) => {
        if (!user) {
          return false;
        }

        return !!(await loader(Deets).loadBy('owner_id', user.id, {
          type: 'email_address',
          is_primary: true,
        }));
      },
    },
  }),
});

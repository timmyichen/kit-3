import { GraphQLObjectType } from 'graphql';
import currentUser from './currentUser';
import searchUsers from './searchUsers';
import userByUsername from './userByUsername';
import friends from './friends';
import userDeets from './userDeets';
import accessibleDeets from './accessibleDeets';
import pendingFriendRequests from './pendingFriendRequests';
import userTodos from './userTodos';
import upcomingBirthdays from './upcomingBirthdays';

// turned strict function types in tsconfig off because: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/21359

export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    currentUser,
    searchUsers,
    userByUsername,
    friends,
    userDeets,
    accessibleDeets,
    pendingFriendRequests,
    userTodos,
    upcomingBirthdays,
  }),
});

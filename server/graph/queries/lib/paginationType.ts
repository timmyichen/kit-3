import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
  GraphQLUnionType,
} from 'graphql';

interface PageInfo {
  hasNext: boolean;
  nextCursor?: string;
}

interface PaginationType {
  items: Array<any>;
  pageInfo: PageInfo;
}

const pageInfoType = new GraphQLObjectType({
  name: 'PaginationInfo',
  fields: () => ({
    hasNext: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (root: PageInfo) => root.hasNext,
    },
    nextCursor: {
      type: GraphQLString,
      resolve: (root: PageInfo) => root.nextCursor,
    },
  }),
});

interface Opts {
  name: string;
  type: GraphQLObjectType | GraphQLUnionType;
  options?: {
    nullable?: boolean;
  };
}

export default ({ name, type, options = {} }: Opts) =>
  new GraphQLObjectType({
    name: `${name}Pagination`,
    description: `Pagination for ${name}`,
    fields: () => ({
      items: {
        type: new GraphQLNonNull(
          new GraphQLList(options.nullable ? type : new GraphQLNonNull(type)),
        ),
        resolve: (root: PaginationType) => root.items,
      },
      pageInfo: {
        type: new GraphQLNonNull(pageInfoType),
        resolve: (root: PaginationType) => root.pageInfo,
      },
    }),
  });

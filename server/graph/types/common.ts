import { GraphQLNonNull, GraphQLString } from 'graphql';

export const commonDeetFields = () => ({
  label: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (obj: any) => obj.label,
  },
  notes: {
    type: GraphQLString,
    resolve: (obj: any) => obj.notes,
  },
  type: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (obj: any) => obj.type,
  },
});

export const timestamps = (opts?: { paranoid: boolean }) => {
  const fields: {
    [s: string]: Object;
  } = {
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (obj: any) => obj.created_at,
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (obj: any) => obj.updated_at,
    },
  };

  if (opts && opts.paranoid) {
    fields.deletedAt = {
      type: GraphQLString,
      resolve: (obj: any) => obj.deleted_at,
    };
  }

  return fields;
};

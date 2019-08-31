import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import deetTypeType from './deetTypeType';

export const commonDeetFields = () => ({
  label: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (obj: any) => obj.label,
  },
  notes: {
    type: new GraphQLNonNull(GraphQLString),
    resolve: (obj: any) => obj.notes,
  },
  type: {
    type: new GraphQLNonNull(deetTypeType),
    resolve: (obj: any) => obj.type,
  },
  isPrimary: {
    type: new GraphQLNonNull(GraphQLBoolean),
    resolve: (obj: any) => obj.is_primary,
  },
});

export const timestamps = (opts?: {
  paranoid?: boolean;
  verified?: boolean;
}) => {
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

  if (opts) {
    if (opts.paranoid) {
      fields.deletedAt = {
        type: GraphQLString,
        resolve: (obj: any) => obj.deleted_at,
      };
    }

    if (opts.verified) {
      fields.verifiedAt = {
        type: new GraphQLNonNull(GraphQLString),
        resolve: (obj: any) => obj.verified_at,
      };
    }
  }

  return fields;
};

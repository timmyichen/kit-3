// from https://github.com/19majkel94/type-graphql/issues/37
declare module 'graphql-upload' {
  import { GraphQLScalarType } from 'graphql';
  import { RequestHandler } from 'express';
  import { Readable } from 'stream';

  export interface UploadMiddlewareOptions {
    maxFieldSize?: number;
    maxFileSize?: number;
    maxFiles?: number;
  }

  export interface Upload {
    createReadStream: () => Readable;
    filename: string;
    mimetype: string;
    encoding: string;
  }

  export const GraphQLUpload: GraphQLScalarType;
  export function graphqlUploadExpress(
    options?: UploadMiddlewareOptions,
  ): RequestHandler;
}

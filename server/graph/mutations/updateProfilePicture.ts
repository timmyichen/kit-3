import { GraphQLNonNull } from 'graphql';
import {
  AuthenticationError,
  GraphQLUpload,
  UserInputError,
} from 'apollo-server';
import userType from '../types/userType';
import { Users } from 'server/models';
import { uploadImage } from 'server/lib/storage';
import { Upload } from 'graphql-upload';
import { GraphQLContext } from 'server/routers/graphql';

interface Args {
  file: Upload;
}

export default {
  description: 'Update the users profile picture',
  type: new GraphQLNonNull(userType),
  args: {
    file: { type: GraphQLUpload },
  },
  async resolve(_: any, { file }: Args, req: GraphQLContext) {
    if (!req.user) {
      throw new AuthenticationError('Must be logged in');
    }

    const processedFile = await file;

    if (!processedFile.mimetype.startsWith('image')) {
      throw new UserInputError('Invaid file type, must be an image');
    }

    const image = await uploadImage(processedFile);

    const user = await Users.findByPk(req.user.id);

    if (!user) {
      throw new Error('user doesnt exist, this should never happen');
    }

    user.update({ profile_picture_id: image.id });

    return user;
  },
};

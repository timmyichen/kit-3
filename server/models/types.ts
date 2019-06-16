import * as mongoose from 'mongoose';

export interface UserType extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  givenName: string;
  familyName?: string;
  birthday?: Date;
  username: string;
  email: string;
  password: string;
}

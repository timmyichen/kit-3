import * as mongoose from 'mongoose';

export interface UserType extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  givenName: string;
  familyName?: string;
  birthday?: Date;
  username: string;
  email: string;
  password: string;
  friends: Array<mongoose.Types.ObjectId>;
  requested: Array<mongoose.Types.ObjectId>;
  requestedBy: Array<mongoose.Types.ObjectId>;
  blocked: Array<mongoose.Types.ObjectId>;
  blockedBy: Array<mongoose.Types.ObjectId>;
}

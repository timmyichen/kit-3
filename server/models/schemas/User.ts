import * as mongoose from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

const schema = new mongoose.Schema(
  {
    givenName: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      index: true,
      required: true,
      unique: true,
    },
    settings: {
      type: Object,
      required: true,
      default: {},
    },
    birthday: {
      type: Date,
    },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    requested: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    requestedBy: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    blocked: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    blockedBy: {
      type: [mongoose.Schema.Types.ObjectId],
    },
  },
  {
    timestamps: true,
  },
);

schema.plugin(mongooseDelete);

export default schema;

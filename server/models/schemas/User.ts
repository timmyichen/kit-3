import * as mongoose from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  },
);

schema.plugin(mongooseDelete);

export default schema;

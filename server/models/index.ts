import * as mongoose from 'mongoose';
import userSchema from './schemas/User';

export const User = mongoose.model('User', userSchema);

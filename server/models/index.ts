import * as mongoose from 'mongoose';
import userSchema from './schemas/User';
import budgetPeriodSchema from './schemas/BudgetPeriod';

export const User = mongoose.model('User', userSchema);
export const BudgetPeriod = mongoose.model('BudgetPeriod', budgetPeriodSchema);

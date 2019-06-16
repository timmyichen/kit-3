import * as mongoose from 'mongoose';

export interface UserType extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

export interface RegularExpense {}

export interface RegularIncome {}

export interface BudgetCategory {}

export interface LineItemSchema {
  label: string;
  type: 'expense' | 'income';
  categoryId: string;
  amount: number;
}

export interface BudgetPeriod extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  periodStart: Date;
  periodEnd: Date;
  userId: mongoose.Schema.Types.ObjectId;
  regularExpenses: Array<RegularExpense>;
  regularIncomes: Array<RegularIncome>;
  budgetCategories: Array<BudgetCategory>;
  lineItems: Array<LineItems>;
  createdAt: Date;
  updatedAt: Date;
}

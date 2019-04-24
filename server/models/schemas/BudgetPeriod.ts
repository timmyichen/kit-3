import * as mongoose from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

const regularExpenseSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const regularIncomeSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const budgetCategorySchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const lineItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true,
    default: 'expense',
  },
  categoryId: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const schema = new mongoose.Schema(
  {
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    regularExpenses: [regularExpenseSchema],
    regularIncomes: [regularIncomeSchema],
    budgetCategories: [budgetCategorySchema],
    lineItems: [lineItemSchema],
  },
  {
    timestamps: true,
  },
);

schema.plugin(mongooseDelete);

export default schema;

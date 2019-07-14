import { DeetType, Deet } from 'server/models/types';

export const requiredString = ({ validate }: { [s: string]: any } = {}) => ({
  allowNull: false,
  validate: {
    notEmpty: true,
    ...validate,
  },
});

export const emptyOptionalString = {
  allowNull: false,
  defaultValue: '',
};

export const getPlainDeetObject = (deet: DeetType, specificType: Deet) => ({
  ...deet.get({ plain: true }),
  [deet.type]: {
    ...specificType.get({ plain: true }),
  },
});

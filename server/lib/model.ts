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

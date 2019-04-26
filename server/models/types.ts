export type UserType = mongoose.Document & {
  name: string;
  email: string;
  password: string;
};

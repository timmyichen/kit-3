export interface User {
  id: number;
  fullName: string;
  username: string;
}

export interface UserSearch extends User {
  isFriend: boolean;
  isRequested: boolean;
  hasRequestedUser: boolean;
  isBlocked: boolean;
}

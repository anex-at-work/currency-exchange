export class User {
  username: string;
  password: string;
  fullName?: string;
}

export interface IUserData {
  username: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface SignInBody {
  email: string;
  password: string;
}

export interface SignUpBody {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

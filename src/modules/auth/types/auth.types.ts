export type UserRole =
  | "normal_user"
  | "admin"
  | "corporate_mgmt"
  | "compliance_officer"
  | "mine_officer"
  | "field_inspector";

export type User = {
  id: string;
  name : string;
  email: string;
  role: UserRole;
};

export type UserPassword = {
  id: string;
  userId: string;
  passwordHash: string;
};

export type tokenPayLoad = {
  userId: string;
  role: UserRole
};

export type loginResult = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
};

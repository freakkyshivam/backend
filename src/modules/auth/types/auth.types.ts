export type UserRole = {
  role:
    | "normal_user"
    | "admin"
    | "corporate_mgmt"
    | "compliance_officer"
    | "mine_officer"
    | "field_inspector";
};

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
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

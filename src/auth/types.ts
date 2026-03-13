export type TempAccountResponse = {
  id: number;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  token: string;
  account: TempAccountResponse;
};

export type RegisterTempAccountRequest = {
  email: string;
  password: string;
  displayName: string;
};

export type LoginTempAccountRequest = {
  email: string;
  password: string;
};

export type AuthSession = AuthResponse;

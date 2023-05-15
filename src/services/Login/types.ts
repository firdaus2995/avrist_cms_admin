export interface ILoginPayload {
  username: string;
  password: string;
}

export interface ILoginResponse {
  login: {
    accessToken: string;
    refreshToken: string;
    roles: string[];
  };
}

export interface IRefreshTokenResponse {
  refreshToken: {
    accessToken: string;
    refreshToken: string;
    roles: string[];
  };
}

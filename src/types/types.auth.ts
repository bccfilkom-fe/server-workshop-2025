/**
 * Auth tokens interface
 */
export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Registration request interface
 */
export interface IRegisterRequest {
  email: string;
  password: string;
}

/**
 * Login request interface
 */
export interface ILoginRequest {
  email: string;
  password: string;
}

/**
 * Token refresh request interface
 */
export interface IRefreshTokenRequest {
  refreshToken: string;
}

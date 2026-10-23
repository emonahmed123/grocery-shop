/** The user as the frontend uses it, independent of the backend's field names. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  /** Only sent by backends that support refreshing; ours currently does not. */
  refreshToken?: string;
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

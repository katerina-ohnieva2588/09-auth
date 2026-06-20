import type { User } from "./user";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: User;
}
export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  // other profile fields can be added as needed
}

export interface SessionInfo {
  user: UserProfile | null;
  access_token?: string;
  expires_at?: number;
}

// User type based on backend GraphQL schema
export interface User {
  _id: string;
  email: string;
  fullname: string;
  phone?: string;
  role?: {
    _id: string;
    name: string;
    description?: string;
    type?: string;
    permissions?: string[];
    inheritsFrom?: string[];
    settings?: unknown;
    isActive?: boolean;
    isDefault?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  roleId?: string;
  status?: 'active' | 'deactivated' | 'blocked';
  createdAt?: string;
  updatedAt?: string;
  // Additional fields that may be present
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  loginAttempts?: number;
  lockUntil?: string;
  lastLogin?: string;
  salt?: string;
  hash?: string;
  emailVerifyToken?: string;
  emailVerifyExpires?: string;
  emailVerified?: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  locale?: string;
  theme?: string;
  timezone?: string;
  notifications?: boolean;
  emailNotifications?: boolean;
}

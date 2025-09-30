import { UserStatus, SystemRole } from './user.enums';

export interface ICreateUserRequest {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone?: string;
  roleId: string;
  residentId?: string;
  buildingAccess?: string[];
  isUsingMobileApp?: boolean;
}

export interface IUpdateUserRequest {
  email?: string;
  name?: string;
  surname?: string;
  phone?: string;
  roleId?: string;
  residentId?: string;
  status?: UserStatus;
  buildingAccess?: string[];
  avatarUrl?: string;
  isUsingMobileApp?: boolean;
}

export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone?: string;
  status: UserStatus;
  buildingAccess?: string[];
  avatarUrl?: string;
  isUsingMobileApp: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;

  // Relationships
  role: {
    id: string;
    name: string;
    permissions: string[];
  };
  resident?: {
    id: string;
    name: string;
    surname: string;
    apartmentId: string;
  };

  // Computed fields
  fullName: string;
  isResident: boolean;
}

export interface IUserListItem {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone?: string;
  status: UserStatus;
  isUsingMobileApp: boolean;
  lastLoginAt?: string;
  createdAt: string;

  // Role info
  roleName: string;
  roleDisplayName: string;

  // Resident info (if applicable)
  isResident: boolean;
  apartmentNumber?: string;
  buildingName?: string;

  // Computed fields
  fullName: string;
}

export interface IUserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: string;
  status?: UserStatus;
  buildingId?: string;
  isResident?: boolean;
  isUsingMobileApp?: boolean;
}

export interface ICreateUserRoleRequest {
  name: string;
  description?: string;
  permissions: string[];
}

export interface IUpdateUserRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
}

export interface IUserRoleResponse {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Stats
  userCount?: number;
}

export interface IAuthResponse {
  user: IUserResponse;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ILoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

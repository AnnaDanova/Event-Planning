export interface UserResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  email: string;
  address?: string;
  profilePhoto?: string;
}

export interface UserRegisterRequest {
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  email: string;
  password: string;
  address?: string;
}

export interface UserUpdateRequest {
  lastName: string;
  bio?: string;
  email: string;
  address?: string;
  profilePhoto?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

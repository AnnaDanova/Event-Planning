export interface UserResponse {
  id: number;
  username: string;
  email: string;
  address?: string;
  profilePhoto?: string;
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
  address?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  email: string;
  address?: string;
  profilePhoto?: string;
}

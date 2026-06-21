import { UserResponse } from './user.model';

export interface SessionCreateRequest {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface SessionResponse {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  speakers?: UserResponse[];
}

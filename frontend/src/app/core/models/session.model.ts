import { UserResponse } from './user.model';

export interface SessionMaterialResponse {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

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
  materials?: SessionMaterialResponse[];
  speakers?: UserResponse[];
}


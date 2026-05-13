export type HealthResponse = {
  status: "healthy";
};

export type Track = {
  id: number;
  title: string;
  artist: string;
  genre: string;
  audio_url: string;
  cover_url: string | null;
  created_at: string;
};

export type CreateTrackInput = {
  title: string;
  artist: string;
  genre: string;
  audio_url: string;
  cover_url?: string | null;
};
export type User = {
  id: number;
  email: string;
  role: "admin";
  created_at: string;
};

export type RegisterInput = {
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
};
export type AuthUser = {
  id: number;
  email: string;
  role: "admin";
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type RegisterResponse = {
  id: number;
};
export type TrackMutationResponse = {
  id: number;
};

export type CreateTrackResponse = TrackMutationResponse;
export type UpdateTrackResponse = TrackMutationResponse;
export type DeleteTrackResponse = TrackMutationResponse;


export type TracksQuery = {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
};

export type PaginatedTracksResponse = {
  items: Track[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type Genre = {
  id: number;
  name: string;
  created_at: string;
};

export type CreateGenreInput = {
  name: string;
};

export type GenreMutationResponse = {
  id: number;
};
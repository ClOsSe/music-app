export type HealthResponse = {
  status: "healthy";
};

export type Track = {
  id: number;
  title: string;
  artist: string;
  audio_url: string;
  cover_url: string | null;
  created_at: string;
};

export type CreateTrackInput = {
  title: string;
  artist: string;
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
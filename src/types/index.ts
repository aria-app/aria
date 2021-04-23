export interface Note {
  __typename?: string;
  id: number;
  points: Point[];
  sequence: Partial<Sequence> & { id: number };
}

export default interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedResponseMetadata;
}

export interface PaginatedResponseMetadata {
  currentPage: number;
  itemsPerPage: number;
  totalItemCount: number;
}

export type Point = {
  __typename?: string;
  x: number;
  y: number;
};

export interface Sequence {
  __typename?: string;
  id: number;
  measureCount: number;
  notes: Note[];
  position: number;
  track: Partial<Track> & { id: number };
}

export interface Song {
  __typename?: string;
  bpm: number;
  createdAt: Date;
  id: number;
  measureCount: number;
  name: string;
  tracks: Track[];
  updatedAt: Date;
  user: Partial<User> & { id: number };
}

export interface Track {
  __typename?: string;
  id: number;
  isMuted: boolean;
  isSoloing: boolean;
  position: number;
  sequences: Sequence[];
  song: Partial<Song> & { id: number };
  voice: Voice;
  volume: number;
}

export interface User {
  __typename?: string;
  createdAt: Date;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  password: string;
  songs: Song[];
}

export interface Voice {
  __typename?: string;
  id: number;
  name: string;
  toneOscillatorType: string;
}

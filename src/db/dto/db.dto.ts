export interface IUserWithoutPass {
  id: string; // uuid v4
  login: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

export interface IUser extends IUserWithoutPass {
  password: string;
}

export interface IArtist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export interface IAlbum {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

export interface ITrack {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

export interface IFavorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export type IDB = IUser | IArtist | IAlbum | ITrack;

export interface IFavSuccessful {
  statusCode: number;
  message: string;
}

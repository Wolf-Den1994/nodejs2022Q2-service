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
  artists: IArtist[]; // favorite artists ids
  albums: IAlbum[]; // favorite albums ids
  tracks: ITrack[]; // favorite tracks ids
}

export type IDB = IUser | IArtist | IAlbum | ITrack;

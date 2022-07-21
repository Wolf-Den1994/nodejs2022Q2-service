import {
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';
import { InfoForUser, notFound, favNotFound } from 'src/utils/constants';
import { uuidValidateV4 } from '../utils/common';
import {
  IUser,
  IArtist,
  IAlbum,
  ITrack,
  IFavorites,
  IDB,
  IFavSuccessful,
} from './dto/db.dto';

class InMemoryDB {
  user: IUser[] = [];
  artist: IArtist[] = [];
  album: IAlbum[] = [];
  track: ITrack[] = [];
  favorites: IFavorites = {
    artists: [] as string[],
    albums: [] as string[],
    tracks: [] as string[],
  };

  async getAll(type: string): Promise<IDB[]> {
    return new Promise((res) => {
      res(this[type]);
    });
  }

  async getById(type: string, id: string): Promise<IDB> {
    return new Promise((res, rej) => {
      if (!uuidValidateV4(id))
        return rej(new BadRequestException(InfoForUser.BAD_REQUEST));
      const findData = this[type]?.find((d: IDB) => d.id === id);
      if (!findData) rej(new NotFoundException(notFound(type)));
      return res(findData);
    });
  }

  async create(type: string, body: IDB): Promise<IDB> {
    return new Promise((res) => {
      this[type]?.push(body);
      return res(body);
    });
  }

  async remove(type: string, id: string): Promise<IDB> {
    return new Promise((res, rej) => {
      if (!uuidValidateV4(id))
        return rej(new BadRequestException(InfoForUser.BAD_REQUEST));
      const findData = this[type]?.find((d: IDB) => d.id === id);
      if (!findData) rej(new NotFoundException(notFound(type)));
      this[type] = this[type]?.filter((d: IDB) => d.id !== id);
      return res(findData);
    });
  }

  async update(type: string, id: string, body: IDB): Promise<IDB> {
    return new Promise((res, rej) => {
      if (!uuidValidateV4(id))
        return rej(new BadRequestException(InfoForUser.BAD_REQUEST));
      const findData = this[type]?.find((d: IDB) => d.id === id);
      if (!findData) rej(new NotFoundException(notFound(type)));
      this[type] = this[type]?.map((d: IDB) => (d.id === body.id ? body : d));
      return res(body);
    });
  }

  async getAllFavorites(type: string): Promise<IFavorites> {
    return new Promise((res) => {
      return res(this[type]);
    });
  }

  async createFav(type: string, id: string): Promise<IFavSuccessful> {
    return new Promise((res, rej) => {
      if (!uuidValidateV4(id))
        return rej(new BadRequestException(InfoForUser.BAD_REQUEST));
      const findData = this[type]?.find((d: IDB) => d.id === id);
      if (!findData)
        return rej(new UnprocessableEntityException(favNotFound(type)));
      if (this.favorites[`${type}s`].some((d: IDB) => d.id === id))
        return rej(new BadRequestException(InfoForUser.DUBLICATE_DATA));
      this.favorites[`${type}s`].push(findData);
      const data = {
        statusCode: HttpStatus.CREATED,
        message: InfoForUser.ADDED_SUCCESSFULY,
      };
      return res(data);
    });
  }

  async removeFav(type: string, id: string): Promise<void> {
    return new Promise((res, rej) => {
      if (!uuidValidateV4(id))
        return rej(new BadRequestException(InfoForUser.BAD_REQUEST));
      const findData = this.favorites[`${type}s`]?.find(
        (d: IDB) => d?.id === id,
      );
      if (!findData) rej(new NotFoundException(notFound(type)));
      this.favorites[`${type}s`] = this.favorites[`${type}s`]?.filter(
        (d: IDB) => d?.id !== id,
      );
      return res(findData);
    });
  }

  async updateFav(type: string, fav: IDB[]): Promise<IDB[]> {
    return new Promise((res) => {
      this.favorites[`${type}s`] = fav;
      return res(fav);
    });
  }
}

const db = new InMemoryDB();

export default db;

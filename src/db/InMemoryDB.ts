import {
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { uuidValidateV4 } from '../utils/common';
import { IUser, IArtist, IAlbum, ITrack, IFavorites, IDB } from './dto/db.dto';

class InMemoryDB {
  user: IUser[] = [];
  artist: IArtist[] = [];
  album: IAlbum[] = [];
  track: ITrack[] = [];
  favorites: IFavorites = {
    artists: [] as IArtist[],
    albums: [] as IAlbum[],
    tracks: [] as ITrack[],
  };

  async getAll(type: string): Promise<IDB[]> {
    return new Promise((res) => {
      res(this[type]);
    });
  }

  async getById(type: string, id: string): Promise<IDB> {
    return new Promise((res, rej) => {
      if (!uuidValidateV4(id))
        return rej(
          new BadRequestException(`Ooops, "${id}" is invalid (not uuid)!`),
        );
      const findData = this[type]?.find((d: IDB) => d.id === id);
      if (!findData) rej(new NotFoundException(`Ooops, ${type} not found!`));
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
        return rej(
          new BadRequestException(`Ooops, "${id}" is invalid (not uuid)!`),
        );
      const findData = this[type]?.find((d: IDB) => d.id === id);
      if (!findData) rej(new NotFoundException(`Ooops, ${type} not found!`));
      this[type] = this[type]?.filter((d: IDB) => d.id !== id);
      return res(findData);
    });
  }

  async update(type: string, id: string, body: IDB): Promise<IDB> {
    return new Promise((res, rej) => {
      if (!uuidValidateV4(id))
        return rej(
          new BadRequestException(`Ooops, "${id}" is invalid (not uuid)!`),
        );
      const findData = this[type]?.find((d: IDB) => d.id === id);
      if (!findData) rej(new NotFoundException(`Ooops, ${type} not found!`));
      this[type] = this[type]?.map((d: IDB) => (d.id === body.id ? body : d));
      return res(body);
    });
  }

  async getAllFavorites(type: string): Promise<IFavorites> {
    return new Promise((res) => {
      return res(this[type]);
    });
  }

  async createFav(type: string, id: string): Promise<void> {
    return new Promise((res, rej) => {
      if (!uuidValidateV4(id))
        return rej(
          new BadRequestException(`Ooops, "${id}" is invalid (not uuid)!`),
        );
      const findData = this[type]?.find((d: IDB) => d.id === id);
      if (!findData)
        return rej(
          new UnprocessableEntityException(`Ooops, ${type} doesn't exist!`),
        );
      this.favorites[`${type}s`].push(findData);
      return res();
    });
  }

  async removeFav(type: string, id: string): Promise<void> {
    return new Promise((res, rej) => {
      if (!uuidValidateV4(id))
        return rej(
          new BadRequestException(`Ooops, "${id}" is invalid (not uuid)!`),
        );
      const findData = this.favorites[`${type}s`]?.find(
        (d: IDB) => d?.id === id,
      );
      if (!findData) rej(new NotFoundException(`Ooops, ${type} not found!`));
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

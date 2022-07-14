import { NotFoundException, BadRequestException } from '@nestjs/common';
import { uuidValidateV4 } from '../utils/common';
import { IUser, IArtist, IDB } from './dto/db.dto';

class InMemoryDB {
  user: IUser[] = [];
  artist: IArtist[] = [];

  async getAll(type: string): Promise<IDB[]> {
    return new Promise((res) => {
      res(this[type]);
    });
  }

  async getById(type: string, id: string): Promise<IDB> {
    return new Promise((res, rej) => {
      if (!uuidValidateV4(id))
        rej(new BadRequestException(`Ooops, "${id}" is invalid (not uuid)!`));
      const findData = this[type]?.find((d: IDB) => d.id === id);
      if (!findData) rej(new NotFoundException(`Ooops, ${type} not found!`));
      res(findData);
    });
  }

  async create(type: string, body: IDB): Promise<IDB> {
    return new Promise((res) => {
      this[type]?.push(body);
      res(body);
    });
  }

  async remove(type: string, id: string): Promise<IDB> {
    return new Promise((res, rej) => {
      if (!uuidValidateV4(id))
        rej(new BadRequestException(`Ooops, "${id}" is invalid (not uuid)!`));
      const findData = this[type]?.find((d: IDB) => d.id === id);
      if (!findData) rej(new NotFoundException(`Ooops, ${type} not found!`));
      this[type] = this[type]?.filter((d: IDB) => d.id !== id);
      res(findData);
    });
  }

  async update(type: string, id: string, body: IDB): Promise<IDB> {
    return new Promise((res, rej) => {
      if (!uuidValidateV4(id))
        rej(new BadRequestException(`Ooops, "${id}" is invalid (not uuid)!`));
      const findData = this[type]?.find((d: IDB) => d.id === id);
      if (!findData) rej(new NotFoundException(`Ooops, ${type} not found!`));
      this[type] = this[type]?.map((d: IDB) => (d.id === body.id ? body : d));
      res(body);
    });
  }
}

const db = new InMemoryDB();

export default db;

import { NotFoundException } from '@nestjs/common';

export interface IUser {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

class InMemoryDB {
  users: IUser[] = [];

  async getAll(type: string): Promise<IUser[]> {
    return new Promise((res) => {
      res(this[type]);
    });
  }

  async getById(type: string, id: string): Promise<IUser> {
    return new Promise((res, rej) => {
      const findData = this[type]?.find((d: IUser) => d.id === id);
      if (!findData) rej(new NotFoundException(`Ooops, ${type} not found!`));
      res(findData);
    });
  }

  async create(type: string, body: IUser): Promise<IUser> {
    return new Promise((res) => {
      this[type]?.push(body);
      res(body);
    });
  }

  async remove(type: string, id: string): Promise<IUser> {
    return new Promise((res, rej) => {
      const findData = this[type]?.find((d: IUser) => d.id === id);
      if (!findData) rej(new NotFoundException(`Ooops, ${type} not found!`));
      this[type] = this[type]?.filter((d: IUser) => d.id !== id);
      res(findData);
    });
  }

  async update(type: string, id: string, body: IUser): Promise<IUser> {
    return new Promise((res, rej) => {
      const findData = this[type]?.find((d: IUser) => d.id === id);
      if (!findData) rej(new NotFoundException(`Ooops, ${type} not found!`));
      this[type] = this[type]?.map((d: IUser) => (d.id === body.id ? body : d));
      res(body);
    });
  }
}

const db = new InMemoryDB();

export default db;

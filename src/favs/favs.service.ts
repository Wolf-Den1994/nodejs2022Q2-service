import { Injectable } from '@nestjs/common';
import { IFavSuccessful } from 'src/db/dto/db.dto';
import db from '../db/InMemoryDB';
import { Fav } from './schemas/favs.schemas';

@Injectable()
export class FavsService {
  data: string;
  constructor() {
    this.data = 'favorites';
  }

  async getAll(): Promise<Fav> {
    const data: Fav = await db.getAllFavorites(this.data);
    return data;
  }

  async create(id: string, type: string): Promise<IFavSuccessful> {
    const data = await db.createFav(type, id);
    return data;
  }

  async remove(id: string, type: string): Promise<void> {
    const data = await db.removeFav(type, id);
    return data;
  }
}

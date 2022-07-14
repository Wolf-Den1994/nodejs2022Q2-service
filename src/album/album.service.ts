import { Injectable } from '@nestjs/common';
import { IAlbum } from '../db/dto/db.dto';
import { v4 } from 'uuid';
import db from '../db/InMemoryDB';
import { Album } from './schemas/album.schemas';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  data: string;
  constructor() {
    this.data = 'album';
  }

  async getAll(): Promise<Album[]> {
    const data: Album[] = (await db.getAll(this.data)) as IAlbum[];
    return data;
  }

  async getById(id: string): Promise<Album> {
    const data: Album = (await db.getById(this.data, id)) as IAlbum;
    return data;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = {
      ...createAlbumDto,
      id: v4(),
    };
    const data: Album = (await db.create(this.data, newAlbum)) as IAlbum;
    return data;
  }

  async remove(id: string): Promise<Album> {
    const data = (await db.remove(this.data, id)) as IAlbum;
    return data;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const oldData: Album = (await db.getById(this.data, id)) as IAlbum;
    const updateAlbum = {
      ...oldData,
      ...updateAlbumDto,
    };
    const data = (await db.update(this.data, id, updateAlbum)) as IAlbum;
    return data;
  }
}

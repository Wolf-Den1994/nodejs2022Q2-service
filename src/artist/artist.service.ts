import { Injectable } from '@nestjs/common';
import { IArtist } from '../db/dto/db.dto';
import { v4 } from 'uuid';
import db from '../db/InMemoryDB';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './schemas/artist.schemas';

@Injectable()
export class ArtistService {
  data: string;
  constructor() {
    this.data = 'artist';
  }

  async getAll(): Promise<Artist[]> {
    const data: Artist[] = (await db.getAll(this.data)) as IArtist[];
    return data;
  }

  async getById(id: string): Promise<Artist> {
    const data: Artist = (await db.getById(this.data, id)) as IArtist;
    return data;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = {
      ...createArtistDto,
      id: v4(),
    };
    const data: Artist = (await db.create(this.data, newArtist)) as IArtist;
    return data;
  }

  async remove(id: string): Promise<Artist> {
    const data = (await db.remove(this.data, id)) as IArtist;
    return data;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const oldData: Artist = (await db.getById(this.data, id)) as IArtist;
    const updateArtist = {
      ...oldData,
      ...updateArtistDto,
    };
    const data = (await db.update(this.data, id, updateArtist)) as IArtist;
    return data;
  }
}

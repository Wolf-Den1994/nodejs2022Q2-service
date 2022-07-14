import { Injectable } from '@nestjs/common';
import { ITrack } from '../db/dto/db.dto';
import { v4 } from 'uuid';
import db from '../db/InMemoryDB';
import { Track } from './schemas/track.schemas';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  data: string;
  constructor() {
    this.data = 'artist';
  }

  async getAll(): Promise<Track[]> {
    const data: Track[] = (await db.getAll(this.data)) as ITrack[];
    return data;
  }

  async getById(id: string): Promise<Track> {
    const data: Track = (await db.getById(this.data, id)) as ITrack;
    return data;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = {
      ...createTrackDto,
      id: v4(),
    };
    const data: Track = (await db.create(this.data, newTrack)) as ITrack;
    return data;
  }

  async remove(id: string): Promise<Track> {
    const data = (await db.remove(this.data, id)) as ITrack;
    return data;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const oldData: Track = (await db.getById(this.data, id)) as ITrack;
    const updateTrack = {
      ...oldData,
      ...updateTrackDto,
    };
    const data = (await db.update(this.data, id, updateTrack)) as ITrack;
    return data;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { Track } from './schemas/track.schemas';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { dataTrack, notFound } from 'src/utils/constants';

@Injectable()
export class TrackService {
  data: string;
  constructor(private prisma: PrismaService) {
    this.data = 'track';
  }

  async getAll(): Promise<Track[]> {
    return await this.prisma.track.findMany({ select: dataTrack });
  }

  async getById(id: string): Promise<Track> {
    try {
      return await this.prisma.track.findUniqueOrThrow({
        where: { id },
        select: dataTrack,
      });
    } catch {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return await this.prisma.track.create({
      data: { ...createTrackDto, id: v4() },
      select: dataTrack,
    });
  }

  async remove(id: string): Promise<Track> {
    try {
      return await this.prisma.track.delete({
        where: { id },
        select: dataTrack,
      });
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: { ...updateTrackDto },
        select: dataTrack,
      });
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }
}

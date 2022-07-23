import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { Track } from './schemas/track.schemas';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { notFound } from 'src/utils/constants';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class TrackService {
  data: string;
  constructor(private prisma: PrismaService, private favs: FavsService) {
    this.data = 'track';
  }

  async getAll(): Promise<Track[]> {
    const data = await this.prisma.track.findMany();
    return data;
  }

  async getById(id: string): Promise<Track> {
    const data = await this.prisma.track.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(notFound(this.data));
    return data;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const data = await this.prisma.track.create({
      data: { ...createTrackDto, id: v4() },
    });
    return data;
  }

  async remove(id: string): Promise<Track> {
    try {
      const data = await this.prisma.track.delete({ where: { id } });
      console.log('data', data);

      await this.prisma.track.updateMany({
        where: { id },
        data: { albumId: null },
      });

      await this.favs.remove(id, 'tracks');

      return data;
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    try {
      const oldData = await this.prisma.track.findUnique({ where: { id } });

      if (!oldData) throw new NotFoundException(notFound(this.data));

      const data = await this.prisma.track.update({
        where: { id },
        data: { ...oldData, ...updateTrackDto },
      });

      return data;
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }
}

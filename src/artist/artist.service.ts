import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './schemas/artist.schemas';
import { PrismaService } from 'src/prisma/prisma.service';
import { dataArtist, notFound } from 'src/utils/constants';

@Injectable()
export class ArtistService {
  data: string;
  constructor(private prisma: PrismaService) {
    this.data = 'artist';
  }

  async getAll(): Promise<Artist[]> {
    return await this.prisma.artist.findMany({ select: dataArtist });
  }

  async getById(id: string): Promise<Artist> {
    try {
      return await this.prisma.artist.findUniqueOrThrow({
        where: { id },
        select: dataArtist,
      });
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return await this.prisma.artist.create({
      data: { ...createArtistDto, id: v4() },
    });
  }

  async remove(id: string): Promise<Artist> {
    try {
      const data = await this.prisma.artist.delete({
        where: { id },
        select: dataArtist,
      });

      await this.prisma.track.updateMany({
        where: { artistId: id },
        data: { artistId: null },
      });
      await this.prisma.album.updateMany({
        where: { artistId: id },
        data: { artistId: null },
      });

      return data;
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    try {
      return await this.prisma.artist.update({
        where: { id },
        data: { ...updateArtistDto },
        select: dataArtist,
      });
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }
}

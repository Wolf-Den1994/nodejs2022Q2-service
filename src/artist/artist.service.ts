import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './schemas/artist.schemas';
import { PrismaService } from 'src/prisma/prisma.service';
import { notFound } from 'src/utils/constants';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class ArtistService {
  data: string;
  constructor(private prisma: PrismaService, private favs: FavsService) {
    this.data = 'artist';
  }

  async getAll(): Promise<Artist[]> {
    const data = await this.prisma.artist.findMany();
    return data;
  }

  async getById(id: string): Promise<Artist> {
    const data = await this.prisma.artist.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(notFound(this.data));
    return data;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const data = await this.prisma.artist.create({
      data: { ...createArtistDto, id: v4() },
    });
    return data;
  }

  async remove(id: string): Promise<Artist> {
    try {
      const data = await this.prisma.artist.delete({ where: { id } });

      if (!data) throw new NotFoundException(notFound(this.data));

      await this.prisma.track.updateMany({
        where: { id },
        data: { artistId: null },
      });
      await this.prisma.album.updateMany({
        where: { id },
        data: { artistId: null },
      });

      await this.favs.remove(id, 'artist');

      return data;
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    try {
      const oldData = await this.prisma.artist.findUnique({ where: { id } });

      if (!oldData) throw new NotFoundException(notFound(this.data));

      const data = await this.prisma.artist.update({
        where: { id },
        data: { ...oldData, ...updateArtistDto },
      });

      return data;
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }
}

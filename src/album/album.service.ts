import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { Album } from './schemas/album.schemas';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { notFound } from 'src/utils/constants';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class AlbumService {
  data: string;
  constructor(private prisma: PrismaService, private favs: FavsService) {
    this.data = 'album';
  }

  async getAll(): Promise<Album[]> {
    const data = await this.prisma.album.findMany();
    return data;
  }

  async getById(id: string): Promise<Album> {
    const data = await this.prisma.album.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(notFound(this.data));
    return data;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const data = await this.prisma.album.create({
      data: { ...createAlbumDto, id: v4() },
    });
    return data;
  }

  async remove(id: string): Promise<Album> {
    try {
      const data = await this.prisma.album.delete({ where: { id } });
      console.log('data', data);
      await this.prisma.track.updateMany({
        where: { id },
        data: { albumId: null },
      });

      await this.favs.remove(id, 'albums');

      return data;
    } catch (error) {
      console.log('error', error);
      throw new NotFoundException(notFound(this.data));
    }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    try {
      const oldData = await this.prisma.album.findUnique({ where: { id } });

      if (!oldData) throw new NotFoundException(notFound(this.data));

      const data = await this.prisma.album.update({
        where: { id },
        data: { ...oldData, ...updateAlbumDto },
      });

      return data;
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }
}

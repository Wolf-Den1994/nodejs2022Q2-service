import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { Album } from './schemas/album.schemas';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { notFound } from 'src/utils/constants';

@Injectable()
export class AlbumService {
  data: string;
  constructor(private prisma: PrismaService) {
    this.data = 'album';
  }

  async getAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async getById(id: string): Promise<Album> {
    try {
      return await this.prisma.album.findUniqueOrThrow({
        where: { id },
      });
    } catch {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return await this.prisma.album.create({
      data: { ...createAlbumDto, id: v4() },
    });
  }

  async remove(id: string): Promise<Album> {
    try {
      const data = await this.prisma.album.delete({ where: { id } });

      await this.prisma.track.updateMany({
        where: { albumId: id },
        data: { albumId: null },
      });

      return data;
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: { ...updateAlbumDto },
      });
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }
}

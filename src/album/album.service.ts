import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { Album } from './schemas/album.schemas';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { dataAlbum, notFound } from 'src/utils/constants';

@Injectable()
export class AlbumService {
  data: string;
  constructor(private prisma: PrismaService) {
    this.data = 'album';
  }

  async getAll(): Promise<Album[]> {
    return await this.prisma.album.findMany({ select: dataAlbum });
  }

  async getById(id: string): Promise<Album> {
    try {
      return await this.prisma.album.findUniqueOrThrow({
        where: { id },
        select: dataAlbum,
      });
    } catch {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return await this.prisma.album.create({
      data: { ...createAlbumDto, id: v4() },
      select: dataAlbum,
    });
  }

  async remove(id: string): Promise<Album> {
    try {
      return await this.prisma.album.delete({
        where: { id },
        select: dataAlbum,
      });
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: { ...updateAlbumDto },
        select: dataAlbum,
      });
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }
}

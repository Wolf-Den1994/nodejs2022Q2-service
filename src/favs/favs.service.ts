import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { fields, IFavSuccessful } from 'src/db/dto/db.dto';
import { Fav } from './schemas/favs.schemas';
import { PrismaService } from 'src/prisma/prisma.service';
import { favNotFound, InfoForUser, notFound } from 'src/utils/constants';

const dataWithoutId = {
  id: false,
  artists: true,
  albums: true,
  tracks: true,
};

const dataArtist = {
  id: true,
  name: true,
  grammy: true,
  favoritesId: false,
};

const dataAlbum = {
  id: true,
  name: true,
  year: true,
  artistId: true,
  favoritesId: false,
};

const dataTrack = {
  id: true,
  name: true,
  duration: true,
  artistId: true,
  albumId: true,
  favoritesId: false,
};

@Injectable()
export class FavsService {
  data: string;
  id = 0;

  constructor(private prisma: PrismaService) {
    this.data = 'favorites';
    this.initFavs();
  }

  async getAll(): Promise<Fav> {
    return await this.prisma.favorites.findUnique({
      where: { id: 0 },
      select: {
        artists: { select: dataArtist },
        albums: { select: dataAlbum },
        tracks: { select: dataTrack },
      },
    });
  }

  async create(id: string, type: fields): Promise<IFavSuccessful> {
    const customType = type.slice(0, -1);

    try {
      await this.prisma[customType].update({
        where: { id: 0 },
        data: { favoritesId: 0 },
      });

      const data = {
        statusCode: HttpStatus.CREATED,
        message: InfoForUser.ADDED_SUCCESSFULY,
      };

      return data;
    } catch (error) {
      throw new UnprocessableEntityException(favNotFound(type));
    }
  }

  async remove(id: string, type: fields): Promise<void> {
    const customType = type.slice(0, -1);

    try {
      await this.prisma[customType].update({
        where: { id: id },
        data: { favoritesId: null },
      });
    } catch (err) {
      throw new NotFoundException(notFound(this.data));
    }
  }

  private async initFavs() {
    try {
      await this.prisma.favorites.findUniqueOrThrow({
        where: { id: 0 },
      });
    } catch {
      await this.prisma.favorites.create({
        data: { id: 0 },
      });
    }
  }

  // private async getTypeById(id: string, type: fields) {
  //   console.log('getTypeById', id, type);
  //   const customType = type.slice(0, -1);
  //   console.log('customType', customType);

  //   try {
  //     const data = await this.prisma[customType].findFirstOrThrow({
  //       where: { id },
  //     });
  //     console.log('data', data);

  //     return data;
  //   } catch {
  //     throw new UnprocessableEntityException(favNotFound(type));
  //   }
  // }
}

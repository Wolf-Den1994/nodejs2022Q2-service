import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { fields, IFavSuccessful } from 'src/db/dto/db.dto';
import { Fav } from './schemas/favs.schemas';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  dataAlbum,
  dataArtist,
  dataTrack,
  favNotFound,
  InfoForUser,
  notFound,
} from 'src/utils/constants';

@Injectable()
export class FavsService {
  data: string;
  id: number;

  constructor(private prisma: PrismaService) {
    this.data = 'favorites';
    this.id = 0;
  }

  async getAll(): Promise<Fav> {
    await this.initFavs();

    return await this.prisma.favorites.findUnique({
      where: { id: this.id },
      select: {
        artists: { select: dataArtist },
        albums: { select: dataAlbum },
        tracks: { select: dataTrack },
      },
    });
  }

  async create(id: string, type: fields): Promise<IFavSuccessful> {
    try {
      await this.initFavs();

      await this.prisma[type].update({
        where: { id },
        data: { favoritesId: this.id },
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
    try {
      await this.initFavs();

      await this.prisma[type].update({
        where: { id },
        data: { favoritesId: null },
      });
    } catch (err) {
      throw new NotFoundException(notFound(this.data));
    }
  }

  private async initFavs() {
    try {
      await this.prisma.favorites.findUniqueOrThrow({
        where: { id: this.id },
      });
    } catch (error) {
      try {
        await this.prisma.favorites.create({
          data: { id: this.id },
        });
      } catch (error) {
        console.error('ERROR INITIAL FAVS:', error);
      }
    }
  }
}

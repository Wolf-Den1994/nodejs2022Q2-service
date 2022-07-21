import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IFavSuccessful } from 'src/db/dto/db.dto';
import { Fav } from './schemas/favs.schemas';
import { PrismaService } from 'src/prisma/prisma.service';
import { favNotFound, InfoForUser, notFound } from 'src/utils/constants';

const dataWithoutId = {
  id: false,
  artists: true,
  albums: true,
  tracks: true,
};

@Injectable()
export class FavsService {
  data: string;
  constructor(private prisma: PrismaService) {
    this.data = 'favorites';
    this.initFavs();
  }

  async getAll(): Promise<Fav> {
    const data = await this.prisma.favorites.findUnique({
      where: { id: 0 },
      select: dataWithoutId,
    });

    const call = await Promise.all(
      Object.entries(data).map(async ([key, value]: [string, string[]]) => [
        key,
        await Promise.all(value.map((id: string) => this.getTypeById(id, key))),
      ]),
    );

    return Object.fromEntries(call);
  }

  async create(id: string, type: string): Promise<IFavSuccessful> {
    await this.getTypeById(id, type);

    await this.prisma.favorites.update({
      where: { id: 0 },
      data: { [type]: { push: id } },
    });

    const data = {
      statusCode: HttpStatus.CREATED,
      message: InfoForUser.ADDED_SUCCESSFULY,
    };

    return data;
  }

  async remove(id: string, type: string): Promise<void> {
    const data = await this.prisma.favorites.findFirstOrThrow({
      where: { id: 0 },
    });

    await this.prisma.favorites.update({
      where: { id: 0 },
      data: {
        [type]: data[type].filter((dataId: string) => dataId !== id),
      },
    });
  }

  private async initFavs() {
    try {
      const data = await this.prisma.favorites.findFirst({
        where: { id: 0 },
      });
      if (!data) {
        await this.prisma.favorites.create({
          data: {
            id: 0,
            artists: [],
            albums: [],
            tracks: [],
          },
        });
      }
    } catch {
      throw new NotFoundException(notFound(this.data));
    }
  }

  private async getTypeById(id: string, type: string) {
    const customType = type.slice(0, -1);

    try {
      const data = await this.prisma[customType].findUnique({ where: { id } });

      if (!data) throw new UnprocessableEntityException(favNotFound(type));

      return data;
    } catch {
      throw new UnprocessableEntityException(favNotFound(type));
    }
  }
}

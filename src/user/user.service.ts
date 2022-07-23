import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUserWithoutPass } from 'src/db/dto/db.dto';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { usePassword } from 'src/utils/common';
import { InfoForUser, notFound } from 'src/utils/constants';
import { PrismaService } from 'src/prisma/prisma.service';

const dataWithoutPass = {
  password: false,
  id: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  login: true,
};

@Injectable()
export class UserService {
  data: string;
  constructor(private prisma: PrismaService) {
    this.data = 'user';
  }

  async getAll(): Promise<IUserWithoutPass[]> {
    const data = await this.prisma.user.findMany({
      select: dataWithoutPass,
    });

    return data;
  }

  async getById(id: string): Promise<IUserWithoutPass> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { id },
        select: dataWithoutPass,
      });
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const data = await this.prisma.user.create({
      data: {
        ...createUserDto,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        id: v4(),
        version: 1,
      },
    });
    console.log('USER data', data);
    const { password, ...otherData } = data;
    usePassword(password);
    return otherData;
  }

  async remove(id: string): Promise<IUserWithoutPass> {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: dataWithoutPass,
      });
    } catch (error) {
      throw new NotFoundException(notFound(this.data));
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUserWithoutPass> {
    // console.log('updateUserDto', id, updateUserDto);
    // const oldData = await this.prisma.user.findUnique({ where: { id } });
    // console.log('oldData', oldData);
    let oldData;
    try {
      oldData = await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });
    } catch {
      throw new NotFoundException(notFound(this.data));
    }

    if (oldData.password !== updateUserDto.oldPassword)
      throw new ForbiddenException(InfoForUser.OLD_PASSWORD_WRONG);

    if (oldData.password === updateUserDto.newPassword)
      throw new ForbiddenException(InfoForUser.OLD_PASSWORD_WRONG);

    return await this.prisma.user.update({
      where: { id },
      data: {
        password: updateUserDto.newPassword,
        version: oldData.version + 1,
        updatedAt: Date.now(),
      },
    });
  }
}

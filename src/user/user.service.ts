import { ForbiddenException, Injectable } from '@nestjs/common';
import { IUser, IUserWithoutPass } from 'src/db/dto/db.dto';
import { v4 } from 'uuid';
import db from '../db/InMemoryDB';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schemas';
import { usePassword } from 'src/utils/common';
import { InfoForUser } from 'src/utils/constants';

@Injectable()
export class UserService {
  data: string;
  constructor() {
    this.data = 'user';
  }

  async getAll(): Promise<IUserWithoutPass[]> {
    const data: User[] = (await db.getAll(this.data)) as IUser[];
    const dataWithoutPass = data.map(
      ({ login, id, createdAt, updatedAt, version }) => ({
        login,
        id,
        createdAt,
        updatedAt,
        version,
      }),
    );
    return dataWithoutPass;
  }

  async getById(id: string): Promise<IUserWithoutPass> {
    const data: User = (await db.getById(this.data, id)) as IUser;
    const { password, ...otherData } = data;
    usePassword(password);
    return otherData;
  }

  async create(createUserDto: CreateUserDto): Promise<IUserWithoutPass> {
    const newUser = {
      ...createUserDto,
      id: v4(),
      createdAt: Date.now(),
      version: 1,
      updatedAt: Date.now(),
    };
    const data: User = (await db.create(this.data, newUser)) as IUser;
    const { password, ...otherData } = data;
    usePassword(password);
    return otherData;
  }

  async remove(id: string): Promise<IUserWithoutPass> {
    const data: User = (await db.remove(this.data, id)) as IUser;
    const { password, ...otherData } = data;
    usePassword(password);
    return otherData;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUserWithoutPass> {
    const oldData: User = (await db.getById(this.data, id)) as IUser;
    if (oldData.password !== updateUserDto.oldPassword)
      throw new ForbiddenException(InfoForUser.OLD_PASSWORD_WRONG);
    const updateUser = {
      ...oldData,
      password: updateUserDto.newPassword,
      version: oldData.version + 1,
      updatedAt: Date.now(),
    };
    const data: User = (await db.update(this.data, id, updateUser)) as IUser;
    const { password, ...otherData } = data;
    usePassword(password);
    return otherData;
  }
}

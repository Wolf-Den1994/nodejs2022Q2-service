import { ForbiddenException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import db from 'src/db/InMemoryDB';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schemas';

@Injectable()
export class UserService {
  data: string;
  constructor() {
    this.data = 'user';
  }

  async getAll(): Promise<User[]> {
    const data: User[] = await db.getAll(this.data);
    return data;
  }

  async getById(id: string): Promise<User> {
    const data: User = await db.getById(this.data, id);
    return data;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = {
      ...createUserDto,
      id: v4(),
      createdAt: Date.now(),
      version: 1,
      updatedAt: Date.now(),
    };
    const data: User = await db.create(this.data, newUser);
    return data;
  }

  async remove(id: string): Promise<User> {
    const data = await db.remove(this.data, id);
    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const oldData: User = await db.getById(this.data, id);
    if (oldData.password !== updateUserDto.oldPassowrd) throw new ForbiddenException('Ooops, passwords do not match!');
    const updateUser = {
      ...oldData,
      password: updateUserDto.newPassword,
      version: oldData.version + 1,
      updatedAt: Date.now(),
    };
    const data = await db.update(this.data, id, updateUser);
    return data;
  }
}

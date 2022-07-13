import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import db from 'src/db/InMemoryDB';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schemas';

@Injectable()
export class UserService {
  async getAll(): Promise<User[]> {
    const data: User[] = await db.getAll('users');
    return data;
  }

  async getById(id: string): Promise<User> {
    const data: User = await db.getById('users', id);
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
    const data: User = await db.create('users', newUser);
    return data;
  }

  async remove(id: string): Promise<User> {
    const data = await db.remove('users', id);
    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const oldData: User = await db.getById('users', id);
    if (updateUserDto.oldPassowrd === oldData.password) {
      const updateUser = {
        ...oldData,
        password: updateUserDto.newPassword,
        version: oldData.version + 1,
        updatedAt: Date.now(),
      };
      const data = await db.update('users', id, updateUser);
      return data;
    }
  }
}

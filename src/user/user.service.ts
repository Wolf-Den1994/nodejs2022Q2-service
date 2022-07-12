import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schemas';

@Injectable()
export class UserService {
  private users = [];

  async getAll(): Promise<User[]> {
    return this.users;
  }

  async getById(id: string): Promise<User> {
    return this.users.find((u) => u.id === id);
  }

  async create(userDto: CreateUserDto) {
    const newUser = {
      ...userDto,
      id: Date.now().toString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async remove(id: string) {
    return this.users.filter((p) => p.id !== id);
  }

  async update(id: string, userDto: UpdateUserDto) {}
}

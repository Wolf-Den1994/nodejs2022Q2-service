import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IUserWithoutPass } from 'src/db/dto/db.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<IUserWithoutPass[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getById(@Param('id') id: string): Promise<IUserWithoutPass> {
    return this.userService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<IUserWithoutPass> {
    return this.userService.create(createUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<IUserWithoutPass> {
    return this.userService.remove(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<IUserWithoutPass> {
    return this.userService.update(id, updateUserDto);
  }
}

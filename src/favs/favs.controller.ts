import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { fields, IFavSuccessful } from 'src/db/dto/db.dto';
import { FavsService } from './favs.service';
import { Fav } from './schemas/favs.schemas';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<Fav> {
    return this.favsService.getAll();
  }

  @Post(':type/:id')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('type') type: fields,
  ): Promise<IFavSuccessful> {
    return this.favsService.create(id, type);
  }

  @Delete(':type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('type') type: fields,
  ): Promise<void> {
    return this.favsService.remove(id, type);
  }
}

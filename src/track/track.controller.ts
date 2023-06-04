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
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './schemas/track.schemas';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<Track[]> {
    return this.trackService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Track> {
    return this.trackService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.trackService.create(createTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Track> {
    return this.trackService.remove(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Body() updateTrackDto: UpdateTrackDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Track> {
    return this.trackService.update(id, updateTrackDto);
  }
}

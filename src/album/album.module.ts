import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FavsService } from 'src/favs/favs.service';

@Module({
  providers: [AlbumService, FavsService],
  controllers: [AlbumController],
})
export class AlbumModule {}

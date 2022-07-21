import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { FavsService } from 'src/favs/favs.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, FavsService],
})
export class ArtistModule {}

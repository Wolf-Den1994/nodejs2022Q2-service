import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavsService } from 'src/favs/favs.service';

@Module({
  providers: [TrackService, FavsService],
  controllers: [TrackController],
})
export class TrackModule {}

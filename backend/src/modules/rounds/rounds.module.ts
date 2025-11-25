import { Module } from '@nestjs/common';
import { RoundsController } from './rounds.controller';
import { RoundsService } from './rounds.service';
import { RoundsRepository } from './rounds.repository';

@Module({
  providers: [RoundsService, RoundsRepository],
  controllers: [RoundsController],
})
export class RoundsModule {}

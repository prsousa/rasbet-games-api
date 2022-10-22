import { Module } from '@nestjs/common';
import { SyncsService } from './syncs.service';
import {
  GamesSyncsController,
  ScoresSyncsController,
} from './syncs.controller';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [GamesModule],
  controllers: [GamesSyncsController, ScoresSyncsController],
  providers: [SyncsService],
  exports: [SyncsService],
})
export class SyncsModule {}

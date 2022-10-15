import { Module } from '@nestjs/common';
import { SyncsService } from './syncs.service';
import { SyncsController } from './syncs.controller';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [GamesModule],
  controllers: [SyncsController],
  providers: [SyncsService],
  exports: [SyncsService],
})
export class SyncsModule {}

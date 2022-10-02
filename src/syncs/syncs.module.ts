import { Module } from '@nestjs/common';
import { SyncsService } from './syncs.service';
import { SyncsController } from './syncs.controller';
import { OddsModule } from 'src/odds/odds.module';

@Module({
  imports: [OddsModule],
  controllers: [SyncsController],
  providers: [SyncsService],
  exports: [SyncsService],
})
export class SyncsModule {}

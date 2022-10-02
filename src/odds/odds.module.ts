import { Module } from '@nestjs/common';
import { OddsService } from './odds.service';
import { OddsController } from './odds.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Odd, OddSchema } from './schemas/odd.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Odd.name, schema: OddSchema }])],
  controllers: [OddsController],
  providers: [OddsService],
  exports: [OddsService],
})
export class OddsModule {}

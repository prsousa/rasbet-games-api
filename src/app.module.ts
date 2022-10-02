import { Module } from '@nestjs/common';
import { OddsModule } from './odds/odds.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncsModule } from './syncs/syncs.module';

@Module({
  imports: [
    OddsModule,
    SyncsModule,
    MongooseModule.forRoot(
      process.env.MONGO_CONNECTION_STRING ||
        'mongodb://localhost:27017/rasbets',
    ),
  ],
})
export class AppModule {}

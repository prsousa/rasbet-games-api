import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncsModule } from './syncs/syncs.module';

@Module({
  imports: [
    GamesModule,
    SyncsModule,
    MongooseModule.forRoot(
      process.env.MONGO_CONNECTION_STRING ||
        'mongodb://localhost:27017/rasbets',
    ),
  ],
})
export class AppModule {}

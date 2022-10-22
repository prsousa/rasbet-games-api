import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { Game } from './schemas/game.schema';
import mongoose from 'mongoose';
import { UpsertGameDto } from './dto/upsert-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<Game>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async upsertMany(upsertGameDtos: UpsertGameDto[]): Promise<Game[]> {
    const res: Game[] = [];

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      for (const upsertGameDto of upsertGameDtos) {
        let game = await this.gameModel.findOneAndUpdate(
          { id: upsertGameDto.id },
          upsertGameDto,
          {
            new: true,
            upsert: true,
          },
        );

        res.push(game);
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return res;
  }

  async findAllVisible(): Promise<Game[]> {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return this.gameModel.find({
      commenceTime: {
        $gte: threeDaysAgo,
      },
    });
  }

  async findOne(id: string): Promise<Game> {
    return this.gameModel.findById(id);
  }
}

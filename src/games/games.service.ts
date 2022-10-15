import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { Game } from './schemas/game.schema';
import { CreateGameDto } from './dto/create-game.dto';
import mongoose from 'mongoose';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name)
    private gameModel: Model<Game>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async upsertMany(createGameDtos: [CreateGameDto]): Promise<Game[]> {
    const res: Game[] = [];

    const session = await this.connection.startSession();
    session.startTransaction();

    await this.gameModel.updateMany({}, { isVisible: false });

    try {
      for (const createGameDto of createGameDtos) {
        let game = await this.gameModel.findOneAndUpdate(
          { id: createGameDto.id },
          { ...createGameDto, isVisible: true },
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
    return this.gameModel.find({
      isVisible: true,
    });
  }

  async findOne(id: string): Promise<Game> {
    return this.gameModel.findById(id);
  }
}

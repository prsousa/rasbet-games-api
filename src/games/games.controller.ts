import {
  Controller,
  Get,
  Param,
  NotFoundException,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { GameEntity } from './entities/game.entity';

import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(): Promise<GameEntity[]> {
    return (await this.gamesService.findAllVisible()).map(
      (game) => new GameEntity(game.toObject()),
    );
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: string): Promise<GameEntity> {
    const game = await this.gamesService.findOne(id);
    if (!game) throw new NotFoundException();

    return new GameEntity(game.toObject());
  }
}

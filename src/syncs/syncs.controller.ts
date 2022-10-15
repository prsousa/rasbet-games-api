import { Controller, Post } from '@nestjs/common';
import axios from 'axios';

import { CreateGameDto } from 'src/games/dto/create-game.dto';
import { GamesService } from 'src/games/games.service';
import { GameEntity } from 'src/games/entities/game.entity';

@Controller('syncs')
export class SyncsController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  async create() {
    const { data } = await axios.get(
      'https://api.the-odds-api.com/v4/sports/soccer_portugal_primeira_liga/odds/',
      {
        params: {
          apiKey: process.env.API_KEY_THE_ODDS_API,
          regions: 'eu',
        },
      },
    );

    const games: [CreateGameDto] = data.map(CreateGameDto.fromJSON);
    const upsertedGames = await this.gamesService.upsertMany(games);
    return {
      games: upsertedGames.map((game) => new GameEntity(game.toObject())),
    };
  }
}

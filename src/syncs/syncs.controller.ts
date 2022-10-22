import { Controller, Post } from '@nestjs/common';
import axios from 'axios';

import { CreateGameDto } from 'src/games/dto/create-game.dto';
import { GamesService } from 'src/games/games.service';
import { GameEntity } from 'src/games/entities/game.entity';
import { UpdateGameScoreDto } from 'src/games/dto/update-game-score.dto';

const MAPPING = {
  Benfica: 1903,
  'FC Porto': 503,
  'Pacos de Ferreira': 507,
  Famalicão: 5531,
  Braga: 5613,
  Estoril: 582,
  'Casa Pia': 6618,
  'Sporting Lisbon': 498,
  Arouca: 712,
  'CS Maritimo': 5575,
  'Santa Clara': 5530,
  Vizela: 5589,
  'Gil Vicente': 5533,
  Chaves: 1103,
  'Boavista Porto': 810,
  'Vitória SC': 5543,
  Portimonense: 5601,
  'Rio Ave FC': 496,
};

@Controller('games-syncs')
export class GamesSyncsController {
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

    const upserts: [CreateGameDto] = data.map(CreateGameDto.fromJSON);
    const upsertedGames = await this.gamesService.upsertMany(upserts);
    return {
      games: upsertedGames.map((game) => new GameEntity(game.toObject())),
    };
  }
}

@Controller('scores-syncs')
export class ScoresSyncsController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  async create() {
    const gamesPromise = this.gamesService.findAllVisible();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: matchesData } = await axios.get(
      'https://api.football-data.org//v4/competitions/PPL/matches',
      {
        params: {
          dateFrom: yesterday.toISOString().split('T')[0],
          dateTo: new Date().toISOString().split('T')[0],
        },
        headers: {
          'X-Auth-Token': process.env.API_KEY_FOOTBALL_DATA,
        },
      },
    );

    const matchesDataByTeams = matchesData.matches
      .filter((match: any) => match.competition.id === 2017)
      .reduce((acc, match) => {
        acc[`${match.homeTeam.id}-${match.awayTeam.id}`] = match;
        return acc;
      }, {});

    const upserts = (await gamesPromise)
      .filter((game) => game.homeTeam in MAPPING && game.awayTeam in MAPPING)
      .map((game) => {
        const key = `${MAPPING[game.homeTeam]}-${MAPPING[game.awayTeam]}`;

        if (key in matchesDataByTeams) {
          const match = matchesDataByTeams[key];
          const score = match.score?.fullTime;

          return new UpdateGameScoreDto(
            game.id,
            match.status === 'FINISHED',
            score.home !== null && score.away !== null
              ? `${score.home}x${score.away}`
              : null,
          );
        }
      })
      .filter((upsert) => !!upsert);

    const upsertedGames = await this.gamesService.upsertMany(upserts);
    return {
      games: upsertedGames.map((game) => new GameEntity(game.toObject())),
    };
  }
}

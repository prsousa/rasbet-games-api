import { UpsertGameDto } from './upsert-game.dto';

export class CreateOutcomeDto {
  name: string;
  price: number;

  static fromJSON(data: any): CreateOutcomeDto {
    return {
      name: data.name,
      price: data.price,
    };
  }
}

export class CreateMarketDto {
  key: string;
  outcomes: [CreateOutcomeDto];

  static fromJSON(data: any): CreateMarketDto {
    return {
      key: data.key,
      outcomes: data.outcomes.map(CreateOutcomeDto.fromJSON),
    };
  }
}

export class CreateBookmakerDto {
  key: string;
  lastUpdate: Date;
  markets: [CreateMarketDto];

  static fromJSON(data: any): CreateBookmakerDto {
    return {
      key: data.key,
      lastUpdate: data.last_update,
      markets: data.markets.map(CreateMarketDto.fromJSON),
    };
  }
}

export class CreateGameDto extends UpsertGameDto {
  commenceTime: string;
  homeTeam: string;
  awayTeam: string;
  bookmakers: [CreateBookmakerDto];

  static fromJSON(data: any): CreateGameDto {
    return {
      id: data.id,
      commenceTime: data.commence_time,
      homeTeam: data.home_team,
      awayTeam: data.away_team,
      bookmakers: data.bookmakers.map(CreateBookmakerDto.fromJSON),
    };
  }
}

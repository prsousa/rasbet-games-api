import { Controller, Post } from '@nestjs/common';
import { SyncsService } from './syncs.service';
import axios from 'axios';

import { CreateOddDto } from 'src/odds/dto/create-odd.dto';
import { OddsService } from 'src/odds/odds.service';
import { OddEntity } from 'src/odds/entities/odd.entity';

@Controller('syncs')
export class SyncsController {
  constructor(
    private readonly syncsService: SyncsService,
    private readonly oddsService: OddsService,
  ) {}

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

    const odds: [CreateOddDto] = data.map(CreateOddDto.fromJSON);
    const upsertedOdds = await this.oddsService.upsertMany(odds);
    return { odds: upsertedOdds.map((odd) => new OddEntity(odd.toObject())) };
  }
}

// class Outcome {
//   @Prop()
//   name: string;

//   @Prop()
//   price: number;
// }

// class Market {
//   @Prop()
//   key: string;

//   @Prop()
//   outcomes: Outcome;
// }

// class Bookmaker {
//   @Prop()
//   key: string;

//   @Prop()
//   lastUpdate: Date;

//   @Prop()
//   markets: [Market];
// }

import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Odd } from './schemas/odd.schema';
import { CreateOddDto } from './dto/create-odd.dto';

@Injectable()
export class OddsService {
  constructor(
    @InjectModel(Odd.name)
    private oddModel: Model<Odd>,
  ) {}

  async upsertMany(createOddDtos: [CreateOddDto]): Promise<Odd[]> {
    const res: Odd[] = [];

    for (const createOddDto of createOddDtos) {
      let odd = await this.oddModel.findOne({ id: createOddDto.id });

      if (!odd) {
        odd = await this.oddModel.create(createOddDto);
      } else {
        const currentBookmakers = odd.bookmakers.reduce((acc, b) => {
          acc[b.key] = b;
          return acc;
        }, {});

        let updateBookmakers = false;

        createOddDto.bookmakers.forEach(async (bookmaker) => {
          if (
            !(bookmaker.key in currentBookmakers) ||
            currentBookmakers[bookmaker.key].lastUpdate != bookmaker.lastUpdate
          ) {
            updateBookmakers = true;
          }
        });

        if (updateBookmakers) {
          odd.bookmakers = createOddDto.bookmakers;
          await odd.save();
        }
      }

      res.push(odd);
    }

    return res;
  }

  async findAll(): Promise<Odd[]> {
    return this.oddModel.find();
  }

  async findOne(id: string): Promise<Odd> {
    return this.oddModel.findById(id);
  }
}

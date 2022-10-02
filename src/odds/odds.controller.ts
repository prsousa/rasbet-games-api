import {
  Controller,
  Get,
  Param,
  NotFoundException,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { OddEntity } from './entities/odd.entity';

import { OddsService } from './odds.service';

@Controller('odds')
export class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(): Promise<OddEntity[]> {
    return (await this.oddsService.findAll()).map(
      (odd) => new OddEntity(odd.toObject()),
    );
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: string): Promise<OddEntity> {
    const odd = await this.oddsService.findOne(id);
    if (!odd) throw new NotFoundException();

    return new OddEntity(odd.toObject());
  }
}

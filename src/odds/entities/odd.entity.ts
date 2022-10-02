import { Exclude } from 'class-transformer';

export class OddEntity {
  @Exclude()
  _id: string;

  @Exclude()
  __v: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  id: string;
  commenceTime: Date;
  homeTeam: string;
  awayTeam: string;
  bookmakers: any;

  constructor(partial: Partial<OddEntity>) {
    Object.assign(this, partial);
  }
}

import { Exclude } from 'class-transformer';

export class GameEntity {
  @Exclude()
  _id: string;

  @Exclude()
  __v: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  isVisible: boolean;

  id: string;
  commenceTime: Date;
  homeTeam: string;
  awayTeam: string;
  completed: boolean;
  scores?: string;
  bookmakers: any[];

  constructor(partial: Partial<GameEntity>) {
    Object.assign(this, partial);
  }
}

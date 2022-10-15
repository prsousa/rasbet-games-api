import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Outcome {
  @Prop()
  name: string;

  @Prop()
  price: number;
}

export class Market {
  @Prop()
  key: string;

  @Prop()
  outcomes: [Outcome];
}

export class Bookmaker {
  @Prop()
  key: string;

  @Prop()
  lastUpdate: Date;

  @Prop()
  markets: [Market];
}

@Schema({ timestamps: true })
export class Game extends Document {
  @Prop()
  id: string;

  @Prop()
  commenceTime: Date;

  @Prop()
  homeTeam: string;

  @Prop()
  awayTeam: string;

  @Prop()
  completed: boolean;

  @Prop()
  scores?: string;

  @Prop()
  bookmakers: [Bookmaker];

  @Prop()
  isVisible: boolean = true;
}

export const GameSchema = SchemaFactory.createForClass(Game);

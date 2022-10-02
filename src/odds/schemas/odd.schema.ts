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
export class Odd extends Document {
  @Prop()
  id: string;

  @Prop()
  commenceTime: Date;

  @Prop()
  homeTeam: string;

  @Prop()
  awayTeam: string;

  @Prop()
  bookmakers: [Bookmaker];
}

export const OddSchema = SchemaFactory.createForClass(Odd);

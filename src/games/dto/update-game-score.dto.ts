import { UpsertGameDto } from './upsert-game.dto';

export class UpdateGameScoreDto extends UpsertGameDto {
  completed: boolean;
  scores?: string;

  constructor(id: string, completed: boolean, scores?: string) {
    super();
    this.id = id;
    this.completed = completed;
    this.scores = scores;
  }
}

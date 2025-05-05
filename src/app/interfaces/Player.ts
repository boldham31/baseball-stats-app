import { Document } from 'mongoose';

export interface IPlayer extends Document {
  playerName: string;
  position: string;
  games: number;
  atBat: number;
  runs: number;
  hits: number;
  doubles: number;
  thirdBaseman: number;
  homeRun: number;
  runBattedIn: number;
  walks: number;
  strikeouts: number;
  stolenBases: number;
  caughtStealing: string;
  avg: number;
  onBasePercentage: number;
  sluggingPercentage: number;
  onBasePlusSlugging: number;
  description?: string;
}

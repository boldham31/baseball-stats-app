import { model, Schema } from "mongoose";
import { IPlayer } from "../interfaces/Player";

const PlayerSchema = new Schema<IPlayer>({
  playerName:       { type: String, unique: true, required: true },
  position:         { type: String, required: true },
  games:            { type: Number },
  atBat:            { type: Number },
  runs:             { type: Number },
  hits:             { type: Number },
  doubles:          { type: Number },
  thirdBaseman:     { type: Number },
  homeRun:          { type: Number },
  runBattedIn:      { type: Number },
  walks:            { type: Number },
  strikeouts:       { type: Number },
  stolenBases:      { type: Number },
  caughtStealing:   { type: String },
  avg:              { type: Number },
  onBasePercentage: { type: Number },
  sluggingPercentage:{ type: Number },
  onBasePlusSlugging:{ type: Number },
  description:      { type: String }
}, { timestamps: true });

export default model<IPlayer>("Player", PlayerSchema);

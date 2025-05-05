import dotenv from 'dotenv';
import path   from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });


import connectToDB from '../mongodb.js';
import Player     from '../models/PlayerModel.js';
import fetch      from 'node-fetch';
import { IPreformattedPlayer } from '../interfaces/PreformattedPlayer';

async function seed() {
  // 1) MONGO_URI is present, call connectToDB()
  await connectToDB();

  // 4) Fetch & upsert
  const resp = await fetch('https://api.hirefraction.com/api/test/baseball');
  const players = (await resp.json()) as IPreformattedPlayer[];

  for (const p of players) {
    await Player.updateOne(
      { playerName: p['Player name'] },
      { $set: {
          playerName:         p['Player name'],
          position:           p.position,
          games:              p.Games,
          atBat:              p['At-bat'],
          runs:               p.Runs,
          hits:               p.Hits,
          doubles:            p['Double (2B)'],
          thirdBaseman:       p['third baseman'],
          homeRun:            p['home run'],
          runBattedIn:        p['run batted in'],
          walks:              p['a walk'],
          strikeouts:         p.Strikeouts,
          stolenBases:        p['stolen base'],
          caughtStealing:     p['Caught stealing'],
          avg:                p.AVG,
          onBasePercentage:   p['On-base Percentage'],
          sluggingPercentage: p['Slugging Percentage'],
          onBasePlusSlugging: p['On-base Plus Slugging'],
        }
      },
      { upsert: true }
    );
  }

  console.log(`✅ Seeded ${players.length} players`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});

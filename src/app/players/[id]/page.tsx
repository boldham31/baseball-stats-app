'use client';

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useParams } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card';
import { PlayerForm } from '@/app/interfaces/PlayerForm';

const playerFetcher = (url: string) => fetch(url).then(res => res.json());

export default function Page() {
  // grab `id` from the URL
  const { id: rawId } = useParams() as { id: string };
  const id = decodeURIComponent(rawId);

  // fetch by id
  const { data: player, error } = useSWR(
    id ? `/api/players/${rawId}` : null,
    playerFetcher
  );

  // form holds all the raw counting stats
  const [form, setForm] = useState<PlayerForm>({
    games: 0,
    atBat: 0,
    runs: 0,
    hits: 0,
    doubles: 0,
    thirdBaseman: 0,
    homeRun: 0,
    runBattedIn: 0,
    walks: 0,
    strikeouts: 0,
    stolenBases: 0,
    caughtStealing: 0,
  });
  const [editing, setEditing] = useState(false);

  if (error) return <p className="text-red-600">Failed to load player.</p>;
  if (!player)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading player…</p>
      </div>
    );

  const startEdit = () => {
    setForm({
      games: player.games,
      atBat: player.atBat,
      runs: player.runs,
      hits: player.hits,
      doubles: player.doubles,
      thirdBaseman: player.thirdBaseman,
      homeRun: player.homeRun,
      runBattedIn: player.runBattedIn,
      walks: player.walks,
      strikeouts: player.strikeouts,
      stolenBases: player.stolenBases,
      caughtStealing: player.caughtStealing,
    });
    setEditing(true);
  };

  const save = async () => {
    await fetch(`/api/players/${rawId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setEditing(false);
    mutate(`/api/players/${rawId}`);
  };

  // list out editable fields as keys of PlayerForm
  const editableFields: { label: string; field: keyof PlayerForm }[] = [
    { label: 'Games', field: 'games' },
    { label: 'At Bats', field: 'atBat' },
    { label: 'Runs', field: 'runs' },
    { label: 'Hits', field: 'hits' },
    { label: 'Doubles', field: 'doubles' },
    { label: 'Triples', field: 'thirdBaseman' },
    { label: 'Home Runs', field: 'homeRun' },
    { label: 'RBI', field: 'runBattedIn' },
    { label: 'Walks', field: 'walks' },
    { label: 'Strikeouts', field: 'strikeouts' },
    { label: 'Stolen Bases', field: 'stolenBases' },
    { label: 'Caught Stealing', field: 'caughtStealing' },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{player.playerName}</CardTitle>
          {player.description && (
            <CardDescription>{player.description}</CardDescription>
          )}
          <CardAction>
            {!editing && (
              <button
                onClick={startEdit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
            )}
          </CardAction>
        </CardHeader>

        <CardContent>
          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editableFields.map(({ label, field }) => (
                <div key={field} className="mb-2">
                  <label className="block mb-1">{label}</label>
                  <input
                    type="number"
                    value={form[field]}
                    onChange={e =>
                      setForm(prev => ({
                        ...prev,
                        [field]: Number(e.target.value),
                      }))
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {[
                ['G', player.games],
                ['AB', player.atBat],
                ['R', player.runs],
                ['H', player.hits],
                ['2B', player.doubles],
                ['3B', player.thirdBaseman],
                ['HR', player.homeRun],
                ['RBI', player.runBattedIn],
                ['BB', player.walks],
                ['SO', player.strikeouts],
                ['SB', player.stolenBases],
                ['CS', player.caughtStealing],
                ['AVG', player.avg.toFixed(3)],
                ['OBP', player.onBasePercentage.toFixed(3)],
                ['SLG', player.sluggingPercentage.toFixed(3)],
                ['OPS', player.onBasePlusSlugging.toFixed(3)],
              ].map(([label, value]) => (
                <div
                  key={label as string}
                  className="flex flex-col items-center bg-muted px-3 py-1 rounded-full"
                >
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-sm">{value}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {editing && (
          <CardFooter>
            <CardAction>
              <button
                onClick={save}
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
            </CardAction>
            <CardAction>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
            </CardAction>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
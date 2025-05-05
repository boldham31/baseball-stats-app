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

const playerFetcher = (url: string) => fetch(url).then(res => res.json());

export default function Page() {
  // grab `id` from the URL instead of `name`
  const { id: rawId } = useParams() as { id: string };
  const id = decodeURIComponent(rawId);

  // fetch by id
  const { data: player, error } = useSWR(
    id ? `/api/players/${rawId}` : null,
    playerFetcher
  );

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ hits: 0, homeRun: 0 });

  if (error) return <p className="text-red-600">Failed to load player.</p>;
  if (!player)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading player…</p>
      </div>
    );

  const startEdit = () => {
    setForm({ hits: player.hits, homeRun: player.homeRun });
    setEditing(true);
  };

  const save = async () => {
    await fetch(`/api/players/${rawId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setEditing(false);
    // revalidate the SWR cache for this id
    mutate(`/api/players/${rawId}`);
  };

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
            <>
              <div className="mb-4">
                <label className="block mb-1">Hits</label>
                <input
                  type="number"
                  value={form.hits}
                  onChange={e =>
                    setForm(f => ({ ...f, hits: Number(e.target.value) }))
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Home Runs</label>
                <input
                  type="number"
                  value={form.homeRun}
                  onChange={e =>
                    setForm(f => ({ ...f, homeRun: Number(e.target.value) }))
                  }
                  className="border p-2 rounded w-full"
                />
              </div>
            </>
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
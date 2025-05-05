'use client';

import Image from "next/image";
import useSWR from "swr";
import Link from "next/link";
import type { IPlayer } from "./interfaces/Player";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const fetcher = (url: string) =>
  fetch(url).then(res => res.json() as Promise<IPlayer[]>);

export default function Home() {
  const { data: players, error } = useSWR<IPlayer[]>('/api/players', fetcher);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center w-full max-w-3xl">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-4">Baseball Players</h1>

        {error && <p className="text-red-500 mb-4">Failed to load players.</p>}

        {!players ? (
          <div className="flex items-center justify-center w-full">
            <Progress className="w-24" />
          </div>
        ) : (
          <ul className="space-y-4 w-full">
            {players.map((p) => (
              <li key={p._id as string}>
                <Link href={`/players/${p._id}`}>
                <Card className="transition hover:bg-gray-100 dark:hover:bg-gray-800">
                  <CardHeader>
                    <CardTitle>{p.playerName}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {p.position}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">G</span>
                        <span className="text-sm">{p.games}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">AB</span>
                        <span className="text-sm">{p.atBat}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">R</span>
                        <span className="text-sm">{p.runs}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">H</span>
                        <span className="text-sm">{p.hits}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">2B</span>
                        <span className="text-sm">{p.doubles}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">3B</span>
                        <span className="text-sm">{p.thirdBaseman}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">HR</span>
                        <span className="text-sm">{p.homeRun}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">RBI</span>
                        <span className="text-sm">{p.runBattedIn}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">BB</span>
                        <span className="text-sm">{p.walks}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">SO</span>
                        <span className="text-sm">{p.strikeouts}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">SB</span>
                        <span className="text-sm">{p.stolenBases}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">CS</span>
                        <span className="text-sm">{p.caughtStealing}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">AVG</span>
                        <span className="text-sm">{p.avg}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">OBP</span>
                        <span className="text-sm">{p.onBasePercentage}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">SLG</span>
                        <span className="text-sm">{p.sluggingPercentage}</span>
                      </div>
                      <div className="flex flex-col items-center bg-muted px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold">OPS</span>
                        <span className="text-sm">{p.onBasePlusSlugging}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Next.js.org
        </a>
      </footer>
    </div>
  );
}
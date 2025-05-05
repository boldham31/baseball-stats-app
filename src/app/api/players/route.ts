import { NextResponse } from 'next/server';
import connectToDB from '../../mongodb';
import Player from '../../models/PlayerModel';

export async function GET() {
  await connectToDB();
  const players = await Player.find()
    .sort({ hits: -1 })
    .lean();
  return NextResponse.json(players);
}
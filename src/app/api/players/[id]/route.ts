import { NextRequest, NextResponse } from "next/server";
import connectToDB from "../../../mongodb";
import Player from "../../../models/PlayerModel";
import OpenAI from "openai";

const openai = new OpenAI();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  await connectToDB();
  const player = await Player.findOne({ _id: id });
  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  if (!player.description) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a baseball historian." },
        {
          role: "user",
          content: `Write a two-sentence bio for ${player.playerName}, who recorded ${player.hits} hits and ${player.homeRun} home runs.`,
        },
      ],
    });
    player.description = completion.choices[0].message.content as string;
    await player.save();
  }

  return NextResponse.json(player);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
): Promise<NextResponse> {
  const { name } = await params;

  await connectToDB();
  const updates = await req.json();
  const updated = await Player.findOneAndUpdate(
    { playerName: name },
    { $set: updates },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

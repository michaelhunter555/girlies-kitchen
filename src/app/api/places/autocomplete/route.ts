import { NextResponse } from "next/server";
import { autocompletePlaces } from "@/lib/google-maps";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const input = searchParams.get("input") || "";
    const sessionToken = searchParams.get("sessionToken") || undefined;
    const predictions = await autocompletePlaces(input, sessionToken);
    return NextResponse.json({ predictions });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Autocomplete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

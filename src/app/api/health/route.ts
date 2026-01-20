import { NextResponse } from "next/server";

export const runtime = "edge"; // opcional, mas bom para ping rápido

export async function GET() {
  return NextResponse.json({ ok: true, service: "ENews", ts: Date.now() });
}

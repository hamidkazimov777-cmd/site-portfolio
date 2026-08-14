import { NextResponse } from "next/server";
import { fetchAllMessages } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const messages = await fetchAllMessages();
  return NextResponse.json(messages);
}

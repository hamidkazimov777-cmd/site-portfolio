import { NextResponse } from "next/server";
import { fetchSettings, upsertSettings } from "@/lib/data";
import { settingsUpdateSchema } from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = (await fetchSettings()) ?? (await upsertSettings({}));
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = settingsUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid settings payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const settings = await upsertSettings(parsed.data);
  return NextResponse.json(settings);
}

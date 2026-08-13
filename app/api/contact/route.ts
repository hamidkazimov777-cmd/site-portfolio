import { NextResponse } from "next/server";
import { createMessage } from "@/lib/data";
import { contactSchema } from "@/lib/validations/contact";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id } = await createMessage(parsed.data);
  return NextResponse.json({ id }, { status: 201 });
}

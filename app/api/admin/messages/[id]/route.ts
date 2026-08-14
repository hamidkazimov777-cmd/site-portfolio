import { NextResponse } from "next/server";
import { z } from "zod";
import { updateMessageRead, deleteMessage } from "@/lib/data";

export const dynamic = "force-dynamic";

const updateSchema = z.object({ read: z.boolean() });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const message = await updateMessageRead(id, parsed.data.read);
  return NextResponse.json(message);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteMessage(id);
  return NextResponse.json({ ok: true });
}

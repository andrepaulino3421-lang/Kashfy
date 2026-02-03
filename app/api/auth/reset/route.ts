
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resetSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/password";
import { sha256 } from "@/lib/security";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const { token, password } = parsed.data;
  const tokenHash = sha256(token);

  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!record) return NextResponse.json({ error: "Token inválido." }, { status: 400 });
  if (record.usedAt) return NextResponse.json({ error: "Token já usado." }, { status: 400 });
  if (record.expiresAt.getTime() < Date.now()) return NextResponse.json({ error: "Token expirado." }, { status: 400 });

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { tokenHash }, data: { usedAt: new Date() } })
  ]);

  return NextResponse.json({ ok: true });
}

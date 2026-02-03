
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validators";
import { verifyPassword } from "@/lib/password";
import { createSessionCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/security";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`login:${ip}`, { maxPerMinute: 12 });
  if (!rl.ok) return NextResponse.json({ error: "Muitas tentativas. Tente novamente mais tarde." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email }, include: { subscription: true } });
  if (!user) return NextResponse.json({ error: "E-mail ou senha inválidos." }, { status: 401 });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "E-mail ou senha inválidos." }, { status: 401 });

  await createSessionCookie({ userId: user.id, email: user.email });
  return NextResponse.json({ ok: true });
}

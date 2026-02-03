
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/password";
import { createSessionCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/security";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`register:${ip}`, { maxPerMinute: 10 });
  if (!rl.ok) return NextResponse.json({ error: "Muitas tentativas. Tente novamente mais tarde." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const { email, password, name } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Este e-mail já está em uso." }, { status: 409 });

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || null,
      subscription: { create: { planId: "FREE", planName: "FREE", status: "INACTIVE" } }
    }
  });

  await createSessionCookie({ userId: user.id, email: user.email });
  return NextResponse.json({ ok: true });
}

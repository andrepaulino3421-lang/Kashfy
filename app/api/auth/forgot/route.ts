
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { forgotSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp, randomToken, sha256 } from "@/lib/security";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`forgot:${ip}`, { maxPerMinute: 8 });
  if (!rl.ok) return NextResponse.json({ error: "Muitas tentativas. Tente novamente mais tarde." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = forgotSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always respond OK to avoid email enumeration
  if (!user) return NextResponse.json({ ok: true });

  const token = randomToken(24);
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt
    }
  });

  // In dev, print a reset link. In prod, integrate an email provider.
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(`[KashFy] Reset link for ${email}: http://localhost:3000/recuperar-senha?token=${token}`);
  }

  return NextResponse.json({ ok: true });
}

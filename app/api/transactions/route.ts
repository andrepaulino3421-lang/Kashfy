
import { NextResponse } from "next/server";
import { requireSession, getUserWithSubscription } from "@/lib/auth";
import { txCreateSchema } from "@/lib/validators";
import { prisma } from "@/lib/db";
import { canCreateTransaction } from "@/lib/permissions";

export async function GET() {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const user = await getUserWithSubscription(session.userId);
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const planId = (user.subscription?.planId || "FREE") as any;
  if (!canCreateTransaction(planId)) return NextResponse.json({ items: [] });

  const items = await prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 200 });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await requireSession().catch(() => null);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const user = await getUserWithSubscription(session.userId);
  if (!user) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const planId = (user.subscription?.planId || "FREE") as any;
  if (!canCreateTransaction(planId)) return NextResponse.json({ error: "Recurso disponível a partir do ESSENCIAL." }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = txCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const tx = await prisma.transaction.create({
    data: {
      userId: user.id,
      type: parsed.data.type,
      valueCents: parsed.data.valueCents,
      category: parsed.data.category,
      description: parsed.data.description,
      method: parsed.data.method,
      date: new Date(parsed.data.dateISO)
    }
  });

  return NextResponse.json({ ok: true, txId: tx.id });
}

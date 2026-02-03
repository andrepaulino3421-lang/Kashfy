
import { NextResponse } from "next/server";
import { requireSession, getUserWithSubscription } from "@/lib/auth";
import { kashAiSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/security";
import { canUseAI } from "@/lib/permissions";
import { chatWithKashAI } from "@/lib/openai";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`kashai:${ip}`, { maxPerMinute: 20 });
  if (!rl.ok) return NextResponse.json({ error: "Muitas tentativas. Tente novamente mais tarde." }, { status: 429 });

  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const user = await getUserWithSubscription(session.userId);
  const planId = (user?.subscription?.planId || "FREE") as any;
  if (!canUseAI(planId)) {
    return NextResponse.json({ error: "Kash AI disponível apenas nos planos ULTRA e MAX." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = kashAiSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const { messages, monthContext, summaryStats } = parsed.data;

  try {
    const reply = await chatWithKashAI({ messages: messages as any, monthContext, summaryStats });
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ error: "Falha ao responder. Verifique sua chave da OpenAI." }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/security";
import { validateKiwifyToken, applyKiwifyWebhook } from "@/lib/kiwify";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`kiwify:${ip}`, { maxPerMinute: 60 });
  if (!rl.ok) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  if (!validateKiwifyToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  if (!payload) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const result = await applyKiwifyWebhook(payload);
  return NextResponse.json({ ok: true, result });
}

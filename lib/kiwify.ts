
import { prisma } from "@/lib/db";

export type KiwifyWebhookPayload = Record<string, any>;

export function validateKiwifyToken(req: Request): boolean {
  const expected = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!expected) return false;
  const headerToken = req.headers.get("x-kiwify-token") || req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const token = headerToken || "";
  return token === expected;
}

function normalizePlanId(raw: string): "FREE" | "ESSENCIAL" | "PLUS" | "ULTRA" | "MAX" {
  const v = (raw || "").toUpperCase();
  if (v.includes("MAX")) return "MAX";
  if (v.includes("ULTRA")) return "ULTRA";
  if (v.includes("PLUS")) return "PLUS";
  if (v.includes("ESSENCIAL") || v.includes("ESSENTIAL")) return "ESSENCIAL";
  return "FREE";
}

function normalizeStatus(raw: string): "ACTIVE" | "CANCELED" | "REFUNDED" | "LATE" | "INACTIVE" {
  const v = (raw || "").toLowerCase();
  if (v.includes("refund") || v.includes("reemb")) return "REFUNDED";
  if (v.includes("cancel")) return "CANCELED";
  if (v.includes("late") || v.includes("atras")) return "LATE";
  if (v.includes("active") || v.includes("aprov") || v.includes("paid") || v.includes("ativo")) return "ACTIVE";
  return "INACTIVE";
}

export function extractKiwifyFields(payload: KiwifyWebhookPayload) {
  // Kiwify payload formats may vary; we parse defensively
  const eventType =
    payload?.event ||
    payload?.type ||
    payload?.trigger ||
    payload?.status ||
    "unknown";

  const customerEmail =
    payload?.customer?.email ||
    payload?.buyer?.email ||
    payload?.email ||
    payload?.order?.customer?.email ||
    "";

  const orderId =
    payload?.order_id ||
    payload?.order?.id ||
    payload?.order?.order_id ||
    payload?.purchase?.order_id ||
    payload?.purchase?.id ||
    "";

  const planRaw =
    payload?.plan ||
    payload?.plan_name ||
    payload?.product?.name ||
    payload?.product_name ||
    payload?.offer?.name ||
    payload?.offer_name ||
    "";

  const periodEndRaw =
    payload?.current_period_end ||
    payload?.subscription?.current_period_end ||
    payload?.subscription?.period_end ||
    payload?.period_end ||
    payload?.next_charge_date ||
    "";

  const planId = normalizePlanId(String(planRaw));
  const status = normalizeStatus(String(eventType));

  const currentPeriodEnd = periodEndRaw ? new Date(periodEndRaw) : null;
  return { eventType: String(eventType), customerEmail: String(customerEmail), orderId: String(orderId), planId, planRaw: String(planRaw), status, currentPeriodEnd };
}

export async function applyKiwifyWebhook(payload: KiwifyWebhookPayload) {
  const fields = extractKiwifyFields(payload);
  await prisma.kiwifyEvent.create({
    data: {
      trigger: fields.eventType,
      orderId: fields.orderId || null,
      email: fields.customerEmail || null,
      payload
    }
  });

  if (!fields.customerEmail) {
    return { ok: true, note: "No customer email in payload; event stored." };
  }

  const user = await prisma.user.findUnique({ where: { email: fields.customerEmail } });
  if (!user) {
    return { ok: true, note: "User not found by email; event stored." };
  }

  const planName = fields.planId === "MAX" ? "MAX (ANUAL)" : fields.planId;

  const firstChargeNote = fields.planId === "MAX" ? "1ª cobrança foi R$ 369,00 — renova R$ 569,00/ano" : null;

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      planId: fields.planId,
      planName,
      status: fields.status,
      currentPeriodEnd: fields.currentPeriodEnd || undefined,
      firstChargeNote: firstChargeNote || undefined
    },
    create: {
      userId: user.id,
      planId: fields.planId,
      planName,
      status: fields.status,
      currentPeriodEnd: fields.currentPeriodEnd || undefined,
      firstChargeNote: firstChargeNote || undefined
    }
  });

  return { ok: true, updatedUserId: user.id, planId: fields.planId, status: fields.status };
}

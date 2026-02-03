
import { prisma } from "@/lib/db";
import { demoData } from "@/lib/demo";
import type { PlanId } from "@/lib/types";
import { clamp } from "@/lib/format";

export type MonthStats = {
  saldoCents: number;
  receitasCents: number;
  despesasCents: number;
  economiaPct: number;
  orcamentoUsadoPct: number | null;
  proximaConta: string;
};

export async function getDashboardData(userId: string, planId: PlanId, monthISO: string) {
  // monthISO like "2026-02"
  if (planId === "FREE") {
    return {
      mode: "FREE" as const,
      stats: demoData.kpis,
      categories: demoData.categories,
      dailyBalance: demoData.dailyBalance,
      lastTransactions: demoData.lastTransactions
    };
  }

  const [yearStr, monthStr] = monthISO.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));

  const txs = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lt: end } },
    orderBy: { date: "desc" },
    take: 1000
  });

  let receitas = 0;
  let despesas = 0;
  const byCat = new Map<string, number>();

  for (const t of txs) {
    if (t.type === "INCOME") receitas += t.valueCents;
    else despesas += t.valueCents;

    if (t.type === "EXPENSE") {
      byCat.set(t.category, (byCat.get(t.category) ?? 0) + t.valueCents);
    }
  }

  const saldo = receitas - despesas;
  const economiaPct = receitas > 0 ? clamp((saldo / receitas) * 100, -999, 999) : 0;

  const categories = Array.from(byCat.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, valueCents]) => ({ name, valueCents }));

  const lastTransactions = txs.slice(0, 10).map((t) => ({
    date: t.date.toISOString().slice(0, 10),
    category: t.category,
    description: t.description,
    type: t.type,
    valueCents: t.valueCents
  }));

  // For simplicity, budgets/projections are placeholders here.
  const orcamentoUsadoPct = null;
  const proximaConta = "Nenhuma conta cadastrada";

  // Simple daily balance points (not a full ledger calc; just a trend):
  const dailyBalance = [
    { day: 1, valueCents: saldo }
  ];

  return {
    mode: "PAID" as const,
    stats: {
      saldoCents: saldo,
      receitasCents: receitas,
      despesasCents: despesas,
      economiaPct,
      orcamentoUsadoPct,
      proximaConta
    },
    categories,
    dailyBalance,
    lastTransactions
  };
}

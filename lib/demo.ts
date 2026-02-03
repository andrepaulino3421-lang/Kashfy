
export const demoData = {
  kpis: {
    saldoCents: 184_500,
    receitasCents: 512_000,
    despesasCents: 327_500,
    economiaPct: 36.0,
    orcamentoUsadoPct: 72.0,
    proximaConta: "Internet — vence em 3 dias"
  },
  categories: [
    { name: "Alimentação", valueCents: 98_000 },
    { name: "Transporte", valueCents: 62_500 },
    { name: "Casa", valueCents: 55_000 },
    { name: "Lazer", valueCents: 42_000 },
    { name: "Outras", valueCents: 70_000 }
  ],
  dailyBalance: [
    { day: 1, valueCents: 210_000 },
    { day: 5, valueCents: 198_000 },
    { day: 10, valueCents: 205_000 },
    { day: 15, valueCents: 190_000 },
    { day: 20, valueCents: 186_500 },
    { day: 25, valueCents: 184_500 }
  ],
  lastTransactions: [
    { date: "2026-02-01", category: "Alimentação", description: "Mercado", type: "EXPENSE", valueCents: 18_900 },
    { date: "2026-01-31", category: "Casa", description: "Luz", type: "EXPENSE", valueCents: 22_300 },
    { date: "2026-01-30", category: "Receita", description: "Freela", type: "INCOME", valueCents: 120_000 }
  ]
};

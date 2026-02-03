import type { PlanId } from "@/lib/types";

export const siteConfig = {
  brandName: "Kashfy",
  tagline: "Sua vida financeira organizada, clara e no controle.",
  supportEmail: "kashfyspt@gmail.com",
  supportPhone: "",
  guaranteeDays: 7,
  links: {
    terms: "/termos",
    privacy: "/privacidade",
    support: "/suporte"
  },
  pricing: {
    currency: "BRL",
    plans: [
      {
        id: "FREE" as PlanId,
        name: "Free",
        priceCentsMonthly: 0,
        blurb: "Comece do básico: entradas, saídas e visão geral.",
        features: [
          "Dashboard básico",
          "Lançamentos manuais",
          "Export simples (CSV)"
        ],
        ctaLabel: "Começar grátis",
        href: "/login"
      },
      {
        id: "PRO" as PlanId,
        name: "Pro",
        priceCentsMonthly: 4990,
        blurb: "Mais clareza: categorias, relatórios e metas simples.",
        features: [
          "Dashboard completo",
          "Categorias & relatórios",
          "Metas e alertas"
        ],
        ctaLabel: "Assinar Pro",
        href: "/planos"
      },
      {
        id: "ULTRA" as PlanId,
        name: "Ultra",
        priceCentsMonthly: 9990,
        blurb: "O melhor custo-benefício: Kash AI e automações.",
        features: [
          "Tudo do Pro",
          "Kash AI (chat)",
          "Insights e recomendações"
        ],
        ctaLabel: "Assinar Ultra",
        href: "/planos"
      }
    ]
  }
} as const;

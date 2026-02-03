
import { PricingGrid } from "@/components/Pricing";
import { siteConfig } from "@/config/site.config";
import { Reveal } from "@/components/Reveal";

export default function PlanosPage() {
  return (
    <section className="container" style={{ padding: "22px 0 40px" }}>
      <Reveal>
        <h1 style={{ margin: 0, fontSize: 24, letterSpacing: -0.3 }}>Planos</h1>
        <p className="muted" style={{ fontSize: 15, lineHeight: 1.7 }}>
          Escolha o nível de controle que faz sentido para você. Comece grátis ou desbloqueie recursos em 2 minutos.
        </p>
      </Reveal>

      <div style={{ height: 10 }} />
      <PricingGrid />

      <div style={{ height: 14 }} />
      <div className="card" style={{ padding: 16 }}>
        <div className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
          Garantia: {siteConfig.guaranteeDays} dias • Suporte: {siteConfig.supportPhone} • {siteConfig.supportEmail}
        </div>
      </div>
    </section>
  );
}

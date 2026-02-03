
import { requireSession, getUserWithSubscription } from "@/lib/auth";
import { siteConfig } from "@/config/site.config";
import Link from "next/link";
import { formatDateBR } from "@/lib/format";

export default async function ContaPage() {
  const session = await requireSession();
  const user = await getUserWithSubscription(session.userId);
  if (!user) return null;

  const sub = user.subscription;
  const planId = (sub?.planId || "FREE") as any;
  const status = sub?.status || "INACTIVE";
  const planName = sub?.planName || "FREE";
  const periodEnd = sub?.currentPeriodEnd ? formatDateBR(sub.currentPeriodEnd) : "—";

  const maxPrice = planId === "MAX" ? "R$ 569,00/ano" : null;

  return (
    <section className="container" style={{ padding: "16px 0" }}>
      <div className="card" style={{ padding: 14, background: "linear-gradient(180deg, var(--greenSoft), transparent)" }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Sua conta</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
          Plano atual: {planName} — {status}
        </div>
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
          Fim do período atual: {periodEnd}
        </div>

        {planId === "MAX" ? (
          <div className="card" style={{ padding: 12, marginTop: 12 }}>
            <div style={{ fontWeight: 900 }}>MAX ativo</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
              Preço oficial: {maxPrice}. {sub?.firstChargeNote ? `Nota: ${sub.firstChargeNote}.` : "Nota: 1ª cobrança foi R$ 369,00."}
            </div>
          </div>
        ) : null}

        <div style={{ height: 12 }} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/planos" className="btn btnPrimary">Fazer upgrade</Link>
          <form action="/api/auth/logout" method="post">
            <button className="btn" type="submit" aria-label="Sair da conta">Sair</button>
          </form>
          <Link href="/app" className="btn">Voltar</Link>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="card" style={{ padding: 14 }}>
        <div style={{ fontWeight: 900 }}>Garantia</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
          Você tem {siteConfig.guaranteeDays} dias para testar (se aplicável ao seu plano e regras do checkout).
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="card" style={{ padding: 14 }}>
        <div style={{ fontWeight: 900 }}>Suporte</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
          WhatsApp/Telefone: {siteConfig.supportPhone}<br />
          E-mail: {siteConfig.supportEmail}
        </div>
      </div>
    </section>
  );
}

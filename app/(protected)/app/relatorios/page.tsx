
import { requireSession, getUserWithSubscription } from "@/lib/auth";
import { canUseAdvancedReports, planGte } from "@/lib/permissions";
import Link from "next/link";

export default async function RelatoriosPage() {
  const session = await requireSession();
  const user = await getUserWithSubscription(session.userId);
  if (!user) return null;

  const planId = (user.subscription?.planId || "FREE") as any;
  const allowedBasic = planGte(planId, "ESSENCIAL");
  const advanced = canUseAdvancedReports(planId);

  return (
    <section className="container" style={{ padding: "16px 0" }}>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Relatórios</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
          Resumo mensal, comparativos e relatórios avançados (ULTRA/MAX).
        </div>
      </div>

      <div style={{ height: 12 }} />

      {!allowedBasic ? (
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontWeight: 900 }}>Recurso bloqueado</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            No modo grátis, relatórios ficam bloqueados. Faça upgrade para ver números reais.
          </div>
          <div style={{ height: 10 }} />
          <Link href="/planos" className="btn btnPrimary">Desbloquear</Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontWeight: 900 }}>Resumo</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            (Básico disponível. Avançado depende de plano.)
          </div>

          <div style={{ height: 12 }} />
          <div className="card" style={{ padding: 14, position: "relative", background: "var(--soft)" }}>
            <div style={{ fontWeight: 900 }}>Relatórios avançados</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
              “Onde dá para cortar”, “Assinaturas recorrentes”, “Parcelamentos futuros”, tendências multi-mês.
            </div>
            {!advanced ? (
              <div style={{ marginTop: 10 }}>
                <Link href="/planos" className="btn btnPrimary">Desbloquear ULTRA/MAX</Link>
              </div>
            ) : (
              <div className="muted" style={{ fontSize: 13, marginTop: 10 }}>
                Você tem acesso. Próximo passo: conectar aos dados reais e insights.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

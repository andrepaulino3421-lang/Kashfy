
import { requireSession, getUserWithSubscription } from "@/lib/auth";
import { planGte } from "@/lib/permissions";
import Link from "next/link";

export default async function OrcamentosPage() {
  const session = await requireSession();
  const user = await getUserWithSubscription(session.userId);
  if (!user) return null;

  const planId = (user.subscription?.planId || "FREE") as any;
  const allowed = planGte(planId, "ESSENCIAL");

  return (
    <section className="container" style={{ padding: "16px 0" }}>
      <div className="card" style={{ padding: 14, position: "relative" }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Orçamentos</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
          Orçamento por categoria com barra de progresso e alertas 80%/100%.
        </div>

        {!allowed ? (
          <div style={{ marginTop: 12 }} className="card">
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 900 }}>Recurso bloqueado</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                No modo grátis, orçamentos ficam bloqueados. Faça upgrade e libere controle real.
              </div>
              <div style={{ height: 10 }} />
              <Link href="/planos" className="btn btnPrimary">Desbloquear</Link>
            </div>
          </div>
        ) : (
          <div className="muted" style={{ fontSize: 13, marginTop: 10 }}>
            (Estrutura pronta. Para manter o ZIP leve, os endpoints de orçamentos não estão incluídos nesta primeira versão.)
          </div>
        )}
      </div>
    </section>
  );
}

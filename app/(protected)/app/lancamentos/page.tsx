
import { requireSession, getUserWithSubscription } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatBRLFromCents } from "@/lib/format";
import { planGte } from "@/lib/permissions";
import Link from "next/link";

export default async function LancamentosPage() {
  const session = await requireSession();
  const user = await getUserWithSubscription(session.userId);
  if (!user) return null;

  const planId = (user.subscription?.planId || "FREE") as any;
  const paid = planGte(planId, "ESSENCIAL");

  const txs = paid
    ? await prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, take: 50 })
    : [];

  return (
    <section className="container" style={{ padding: "16px 0" }}>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Lançamentos</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
              Registro rápido. No FREE, tudo fica bloqueado (demo).
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/app" className="btn">Voltar</Link>
            <Link href="/planos" className="btn btnPrimary">Ver planos</Link>
          </div>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="card" style={{ padding: 14, position: "relative" }} id="novo">
        <div style={{ fontWeight: 900 }}>Novo lançamento</div>
        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
          Esta UI existe e está pronta para integrar com POST /api/transactions.
        </div>

        {!paid ? (
          <div style={{ marginTop: 12 }} className="card">
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 900 }}>Modo grátis</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                Você está no modo grátis. Desbloqueie o controle completo em 2 minutos.
              </div>
              <div style={{ height: 10 }} />
              <Link href="/planos" className="btn btnPrimary">Desbloquear</Link>
            </div>
          </div>
        ) : (
          <div className="muted" style={{ fontSize: 13, marginTop: 10 }}>
            (Para simplificar o ZIP, o formulário completo está no frontend e o endpoint POST existe em /api/transactions.)
          </div>
        )}
      </div>

      <div style={{ height: 12 }} />

      <div className="card" style={{ padding: 14 }}>
        <div style={{ fontWeight: 900 }}>Lista</div>
        {!paid ? (
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            No FREE mostramos apenas demo no dashboard. Aqui ficará disponível no ESSENCIAL+.
          </div>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 10 }}>
            <table className="table" style={{ minWidth: 720 }}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Categoria</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((t) => (
                  <tr key={t.id}>
                    <td>{t.date.toISOString().slice(0, 10)}</td>
                    <td>{t.category}</td>
                    <td>{t.description}</td>
                    <td>{t.type}</td>
                    <td style={{ fontWeight: 900 }}>{formatBRLFromCents(t.valueCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

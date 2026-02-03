import { requireSession, getUserWithSubscription } from "@/lib/auth";
import { getDashboardData } from "@/lib/finance";
import { AppTopbar } from "@/components/app/AppTopbar";
import { BarList } from "@/components/app/BarList";
import { LineChart } from "@/components/app/LineChart";
import { LockedOverlay } from "@/components/app/LockedOverlay";
import { formatBRLFromCents } from "@/lib/format";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import styles from "./page.module.css";

export default async function AppDashboardPage({ searchParams }: { searchParams: { month?: string } }) {
  const session = await requireSession();
  const user = await getUserWithSubscription(session.userId);

  if (!user) return null;

  const planId = (user.subscription?.planId || "FREE") as any;
  const planName = user.subscription?.planName || "FREE";
  const status = user.subscription?.status || "INACTIVE";
  const month = (searchParams.month || new Date().toISOString().slice(0, 7)) as string;

  const data = await getDashboardData(user.id, planId, month);

  return (
    <div>
      <AppTopbar month={month} />
      <section className="container" style={{ padding: "16px 0" }}>
        <div style={{ display: "grid", gap: 12 }}>
          <div className="card" style={{ padding: 14, background: "linear-gradient(180deg, var(--greenSoft), transparent)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <div className="muted" style={{ fontSize: 12 }}>Plano atual</div>
                <div style={{ fontWeight: 900, fontSize: 16 }}>{planName} — {status}</div>
                {planId === "FREE" ? (
                  <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                    Você está no modo grátis (demo). Desbloqueie o controle completo em 2 minutos.
                  </div>
                ) : (
                  <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                    Garantia de {siteConfig.guaranteeDays} dias (se aplicável) • Suporte: {siteConfig.supportPhone}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href="/planos" className="btn" aria-label="Ver planos">Ver planos</Link>
                <Link href="/conta" className="btn btnPrimary" aria-label="Minha conta">Minha conta</Link>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }} className={styles.kpiGrid}>
            <KpiCard title="Saldo do mês" value={formatBRLFromCents(data.stats.saldoCents)} note="Receitas - despesas" />
            <KpiCard title="Receitas do mês" value={formatBRLFromCents(data.stats.receitasCents)} note="Total no período" />
            <KpiCard title="Despesas do mês" value={formatBRLFromCents(data.stats.despesasCents)} note="Total no período" />
            <KpiCard title="Economia (%)" value={`${data.stats.economiaPct.toFixed(1)}%`} note="Saldo/Receita" />
            <KpiCard title="Orçamento usado (%)" value={data.stats.orcamentoUsadoPct == null ? "—" : `${data.stats.orcamentoUsadoPct.toFixed(0)}%`} note="Se houver orçamento" />
            <KpiCard title="Próxima conta" value={data.stats.proximaConta} note="Ajuda a não esquecer" />
          </div>

          <div style={{ display: "grid", gap: 12 }} className={styles.grid2}>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 900 }}>Despesas por categoria</div>
                  <div className="muted" style={{ fontSize: 13 }}>Top 5 + Outras</div>
                </div>
              </div>
              <div style={{ height: 12 }} />
              <BarList items={data.categories} />
            </div>

            <div className="card" style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 900 }}>Saldo diário</div>
                  <div className="muted" style={{ fontSize: 13 }}>Linha simples</div>
                </div>
              </div>
              <div style={{ height: 12 }} />
              <LineChart points={data.dailyBalance} />
            </div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 900 }}>Últimos lançamentos</div>
                <div className="muted" style={{ fontSize: 13 }}>No mobile vira cards; no desktop tabela</div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href="/app/lancamentos" className="btn" aria-label="Ver tudo">Ver tudo</Link>
                <Link href="/app/lancamentos#novo" className="btn btnPrimary" aria-label="Adicionar lançamento">Adicionar lançamento</Link>
              </div>
            </div>

            <div style={{ height: 12 }} />
            <div className={styles.tableWrap}>
              <table className="table">
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
                  {data.lastTransactions.slice(0, 5).map((t) => (
                    <tr key={`${t.date}-${t.description}`}>
                      <td>{t.date}</td>
                      <td>{t.category}</td>
                      <td>{t.description}</td>
                      <td>{t.type}</td>
                      <td style={{ fontWeight: 800 }}>{formatBRLFromCents(t.valueCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.mobileCards} style={{ display: "grid", gap: 10 }}>
              {data.lastTransactions.slice(0, 3).map((t) => (
                <div key={`${t.date}-${t.description}`} className="card" style={{ padding: 12, background: "var(--soft)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 800 }}>{t.category}</div>
                    <div style={{ fontWeight: 900, color: t.type === "INCOME" ? "var(--green)" : "var(--text)" }}>
                      {formatBRLFromCents(t.valueCents)}
                    </div>
                  </div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{t.description}</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>{t.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }} className={styles.grid2}>
            <div className="card" style={{ padding: 14, position: "relative" }}>
              <div style={{ fontWeight: 900 }}>Alertas e Insights</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 6, lineHeight: 1.7 }}>
                • Alertas de orçamento (80%/100%)<br />
                • Recorrências detectadas (ULTRA/MAX)<br />
                • Callout de meta
              </div>
              {planId === "FREE" ? (
                <LockedOverlay bullets={["Alertas automáticos por categoria", "Insights para cortar excessos sem sofrimento"]} />
              ) : null}
            </div>

            <div className="card" style={{ padding: 14, position: "relative" }}>
              <div style={{ fontWeight: 900 }}>Ações rápidas</div>
              <div style={{ height: 10 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button className="btn" aria-label="Adicionar receita">Adicionar receita</button>
                <button className="btn" aria-label="Adicionar despesa">Adicionar despesa</button>
                <button className="btn" aria-label="Criar orçamento">Criar orçamento</button>
                <button className="btn" aria-label="Criar meta">Criar meta</button>
                <button className="btn" aria-label="Importar CSV">Importar CSV</button>
                <button className="btn" aria-label="Exportar CSV">Exportar CSV</button>
              </div>
              {planId === "FREE" ? (
                <LockedOverlay bullets={["Registre lançamentos reais", "Importe CSV e ganhe velocidade"]} cta="Desbloquear" />
              ) : null}
            </div>
          </div>
        </div>
</section>
    </div>
  );
}

function KpiCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="muted" style={{ fontSize: 12 }}>{title}</div>
      <div style={{ fontWeight: 900, fontSize: 22, marginTop: 6, letterSpacing: -0.2, lineHeight: 1.15 }}>
        {value}
      </div>
      <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>{note}</div>
    </div>
  );
}

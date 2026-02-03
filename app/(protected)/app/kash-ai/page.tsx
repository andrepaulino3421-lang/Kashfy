import { requireSession, getUserWithSubscription } from "@/lib/auth";
import { canUseKashAI } from "@/lib/permissions";
import { AppTopbar } from "@/components/app/AppTopbar";
import { KashAIChat } from "@/components/app/KashAIChat";

export default async function KashAIPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { userId } = requireSession();
  const me = await getUserWithSubscription(userId);
  const planId = (me?.subscription?.planId || "FREE") as any;
  const month = typeof searchParams.month === "string" ? searchParams.month : new Date().toISOString().slice(0, 7);

  return (
    <div>
      <AppTopbar month={month} />
      <div className="container" style={{ padding: "22px 0 60px" }}>
        <h1 style={{ margin: "10px 0 6px" }}>Kash AI</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          Uma assistente financeira conversável: perguntas, insights e planos de ação.
        </p>

        {!canUseKashAI(planId) ? (
          <div className="card" style={{ padding: 18 }}>
            <div className="badge" style={{ marginBottom: 10 }}>Recurso do plano Ultra</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Desbloqueie o Kash AI</div>
            <div className="muted" style={{ marginBottom: 14 }}>
              Para usar o chat, assine o plano Ultra (ou superior).
            </div>
            <a className="btn btnPrimary" href="/planos">Ver planos</a>
          </div>
        ) : (
          <KashAIChat />
        )}
      </div>
    </div>
  );
}

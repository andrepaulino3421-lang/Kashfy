
import { siteConfig } from "@/config/site.config";
import { Reveal } from "@/components/Reveal";

export default function ComoFuncionaPage() {
  return (
    <section className="container" style={{ padding: "22px 0 40px" }}>
      <Reveal>
        <h1 style={{ margin: 0, fontSize: 24, letterSpacing: -0.3 }}>Como funciona</h1>
        <p className="muted" style={{ fontSize: 15, lineHeight: 1.7 }}>
          O {siteConfig.brandName} foi pensado para ser simples no celular: você olha os números, entende o mês e faz pequenos ajustes sem culpa.
        </p>

        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          {[
            { title: "1) Crie sua conta", body: "Entre com e-mail e senha. Em segundos você já acessa o app." },
            { title: "2) Escolha um plano (ou continue grátis)", body: "No FREE você vê a experiência com dados demo. Nos planos pagos você registra dados reais e desbloqueia recursos." },
            { title: "3) Organize em minutos", body: "Veja KPIs, categorias e lançamentos. O objetivo é clareza + consistência." },
            { title: "4) Use o Kash AI (ULTRA/MAX)", body: "Quando disponível, ele te dá ações práticas: cortes inteligentes, orçamento por categoria e plano de ação do mês." }
          ].map((s) => (
            <div key={s.title} className="card" style={{ padding: 16 }}>
              <div style={{ fontWeight: 900 }}>{s.title}</div>
              <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}


import { siteConfig } from "@/config/site.config";
import { Reveal } from "@/components/Reveal";

export default function FAQPage() {
  return (
    <section className="container" style={{ padding: "22px 0 40px" }}>
      <Reveal>
        <h1 style={{ margin: 0, fontSize: 24, letterSpacing: -0.3 }}>FAQ</h1>
        <p className="muted" style={{ fontSize: 15, lineHeight: 1.7 }}>
          Respostas rápidas para você decidir com tranquilidade.
        </p>

        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          {siteConfig.copy.faqs.map((f) => (
            <div key={f.q} className="card" style={{ padding: 16 }}>
              <div style={{ fontWeight: 900 }}>{f.q}</div>
              <div className="muted" style={{ fontSize: 14, marginTop: 6, lineHeight: 1.7 }}>{f.a}</div>
            </div>
          ))}

          <div className="card" style={{ padding: 16, background: "var(--greenSoft)" }}>
            <div style={{ fontWeight: 900 }}>Suporte</div>
            <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>
              WhatsApp/Telefone: {siteConfig.supportPhone}<br />
              E-mail: {siteConfig.supportEmail}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import { Reveal } from "@/components/Reveal";
import { CTAStickyMobile } from "@/components/CTAStickyMobile";
import styles from "./page.module.css";

export default function HomePage() {
  const c = siteConfig.copy;

  return (
    <div>
      <section className="container" style={{ padding: "26px 0 18px" }}>
        <Reveal>
          <div className="card shadow-soft" style={{ padding: 18, background: "linear-gradient(180deg, var(--greenSoft), transparent)" }}>
            <div className="badge badgeGreen" style={{ marginBottom: 10 }}>
              <span aria-hidden="true">✓</span>
              <span>Garantia de {siteConfig.guaranteeDays} dias</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 26, letterSpacing: -0.4, lineHeight: 1.15 }}>{c.headline}</h1>
            <p className="muted" style={{ marginTop: 10, marginBottom: 0, fontSize: 15, lineHeight: 1.6 }}>
              {c.subheadline}
            </p>

            <div style={{ height: 14 }} />
            <div style={{ display: "grid", gap: 10 }}>
              {c.bullets.map((b) => (
                <div key={b} className="badge" style={{ justifyContent: "flex-start", background: "var(--surface)" }}>
                  <span aria-hidden="true" style={{ color: "var(--green)", fontWeight: 900 }}>•</span>
                  <span style={{ fontSize: 13 }}>{b}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 16 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Link href="/cadastro" className="btn btnPrimary" aria-label="Começar agora">
                {c.primaryCta}
              </Link>
              <Link href="/planos" className="btn" aria-label="Ver planos">
                {c.secondaryCta}
              </Link>
            </div>

            <div style={{ height: 14 }} />
            <div className="card" style={{ padding: 14, background: "var(--surface)" }}>
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ fontWeight: 900 }}>{c.whyItWorksTitle}</div>
                  <div className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>{c.whyItWorksBody}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  {c.trustRow.map((t) => (
                    <div key={t.title} className="card" style={{ padding: 12, background: "var(--soft)" }}>
                      <div style={{ fontWeight: 900, fontSize: 14 }}>{t.title}</div>
                      <div className="muted" style={{ fontSize: 13 }}>{t.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {siteConfig.featureFlags.enableTestimonials && (
        <section className="container" style={{ padding: "10px 0 10px" }}>
          <Reveal>
            <h2 style={{ margin: "0 0 10px", fontSize: 18 }}>O que as pessoas dizem</h2>
            <div style={{ display: "grid", gap: 12 }} className={styles.tGrid}>
              {c.testimonials.map((t) => (
                <div key={t.quote} className="card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 14, lineHeight: 1.6 }}>&ldquo;{t.quote}&rdquo;</div>
                  <div style={{ height: 10 }} />
                  <div className="muted" style={{ fontSize: 12 }}>{t.name} • {t.tag}</div>
                </div>
              ))}
            </div>
          </Reveal>
</section>
      )}

      <section className="container" style={{ padding: "10px 0 60px" }}>
        <Reveal>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ fontWeight: 900 }}>Pronto para começar?</div>
              <div className="muted" style={{ fontSize: 14 }}>
                Em 2 minutos você já vê clareza — e se não amar, você tem {siteConfig.guaranteeDays} dias de garantia.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Link href="/planos" className="btn btnPrimary">Ver planos</Link>
                <Link href="/planos#free" className="btn">Continuar grátis</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <CTAStickyMobile />
    </div>
  );
}

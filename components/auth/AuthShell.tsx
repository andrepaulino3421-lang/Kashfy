
import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export function AuthShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container" style={{ padding: "22px 0 40px" }}>
      <div className="card shadow-soft" style={{ padding: 18 }}>
        <div className="badge badgeGreen" style={{ marginBottom: 10 }}>
          <span aria-hidden="true">✓</span>
          <span>Garantia de {siteConfig.guaranteeDays} dias</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>{title}</h1>
        <p className="muted" style={{ margin: "8px 0 0", lineHeight: 1.7 }}>{subtitle}</p>

        <div style={{ height: 14 }} />
        {children}

        <hr className="soft" />
        <div className="muted" style={{ fontSize: 13 }}>
          Suporte: {siteConfig.supportPhone} • {siteConfig.supportEmail} •{" "}
          <Link href="/planos" style={{ textDecoration: "underline" }}>Ver planos</Link>
        </div>
      </div>
    </section>
  );
}


import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: 40, background: "var(--bg)" }}>
      <div className="container" style={{ padding: "24px 0" }}>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 800 }}>{siteConfig.brandName}</div>
              <div className="muted" style={{ fontSize: 13 }}>
                Garantia de {siteConfig.guaranteeDays} dias • Suporte: {siteConfig.supportPhone} • {siteConfig.supportEmail}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href={siteConfig.links.terms} className="muted" style={{ fontSize: 13 }}>Termos</Link>
              <Link href={siteConfig.links.privacy} className="muted" style={{ fontSize: 13 }}>Privacidade</Link>
              <Link href={siteConfig.links.cookies} className="muted" style={{ fontSize: 13 }}>Cookies</Link>
              <Link href={siteConfig.links.blog} className="muted" style={{ fontSize: 13 }}>Blog</Link>
            </div>
          </div>

          <div className="muted" style={{ fontSize: 12 }}>
            © {new Date().getFullYear()} {siteConfig.brandName}. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}

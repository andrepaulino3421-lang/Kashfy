
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/config/site.config";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { getMeClient } from "@/components/auth/client";

const nav = [
  { href: "/", label: "Home" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/planos", label: "Planos" },
  { href: "/faq", label: "FAQ" }
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let ok = true;
    getMeClient()
      .then((me) => ok && setAuthed(!!me))
      .catch(() => ok && setAuthed(false));
    return () => {
      ok = false;
    };
  }, []);

  const active = useMemo(() => new Set([pathname]), [pathname]);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "color-mix(in srgb, var(--bg) 88%, transparent)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "saturate(150%) blur(8px)"
        }}
      >
        <div className="container" style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" aria-label={`${siteConfig.brandName} — página inicial`}>
            <Logo size={34} />
          </Link>

          <nav aria-label="Navegação principal" style={{ display: "none" }} className="navDesktop">
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: 14,
                    color: active.has(item.href) ? "var(--text)" : "var(--muted)",
                    fontWeight: active.has(item.href) ? 700 : 600
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <Link href={authed ? "/app" : "/login"} className="btn btnPrimary" aria-label="Entrar ou acessar minha conta">
                {authed ? "Minha Conta" : "Entrar"}
              </Link>
            </div>
          </nav>

          <div className="navMobile" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="btn"
              style={{ padding: "10px 12px" }}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true" style={{ fontWeight: 900 }}>☰</span>
            </button>
            <Link href={authed ? "/app" : "/login"} className="btn btnPrimary" aria-label="Entrar ou acessar minha conta">
              {authed ? "Conta" : "Entrar"}
            </Link>
          </div>
        </div>

        {open && (
          <div className="container" style={{ paddingBottom: 14 }}>
            <div className="card" style={{ padding: 12 }}>
              <div style={{ display: "grid", gap: 8 }}>
                {nav.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="btn">
                    {item.label}
                  </Link>
                ))}
                <Link href={authed ? "/app" : "/login"} onClick={() => setOpen(false)} className="btn btnPrimary">
                  {authed ? "Minha Conta" : "Entrar"}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <style jsx>{`
        @media (min-width: 900px) {
          .navDesktop { display: block !important; }
          .navMobile { display: none !important; }
        }
      `}</style>
    </>
  );
}

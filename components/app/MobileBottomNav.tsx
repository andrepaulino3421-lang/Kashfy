
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const items = [
  { href: "/app", label: "Início", icon: "⌂" },
  { href: "/app/lancamentos", label: "Lanç.", icon: "≡" },
  { href: "/app/orcamentos", label: "Orç.", icon: "▦" },
  { href: "/app/metas", label: "Metas", icon: "◎" },
  { href: "/app/relatorios", label: "Relat.", icon: "▤" },
  { href: "/conta", label: "Conta", icon: "☺" }
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <>
      <nav
        className="safeBottom"
        aria-label="Navegação do app"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 70,
          borderTop: "1px solid var(--border)",
          background: "color-mix(in srgb, var(--bg) 92%, transparent)",
          backdropFilter: "saturate(150%) blur(10px)"
        }}
      >
        <div className="container" style={{ padding: "10px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 6 }}>
            {items.map((it) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className="card"
                  style={{
                    padding: 8,
                    borderRadius: 14,
                    textAlign: "center",
                    border: active ? `1px solid color-mix(in srgb, var(--green) 35%, var(--border))` : "1px solid var(--border)",
                    background: active ? "var(--greenSoft)" : "var(--surface)"
                  }}
                  aria-label={it.label}
                >
                  <div aria-hidden="true" style={{ fontWeight: 900, color: "var(--text)" }}>{it.icon}</div>
                  <div className="muted" style={{ fontSize: 11, lineHeight: 1.1, marginTop: 4 }}>{it.label}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <style jsx>{`
        @media (min-width: 900px){
          nav{ display:none; }
        }
      `}</style>
    </>
  );
}

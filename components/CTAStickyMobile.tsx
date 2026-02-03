
"use client";

import Link from "next/link";

export function CTAStickyMobile() {
  return (
    <>
      <div
        className="safeBottom"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
          background: "color-mix(in srgb, var(--bg) 92%, transparent)",
          borderTop: "1px solid var(--border)",
          backdropFilter: "saturate(150%) blur(10px)"
        }}
      >
        <div className="container" style={{ padding: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Link href="/planos" className="btn" aria-label="Ver planos">
            Ver planos
          </Link>
          <Link href="/cadastro" className="btn btnPrimary" aria-label="Começar agora">
            Começar
          </Link>
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 900px){
          div.safeBottom{ display: none; }
        }
      `}</style>
    </>
  );
}

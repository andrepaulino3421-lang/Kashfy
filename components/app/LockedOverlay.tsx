
"use client";

import Link from "next/link";
import React from "react";

export function LockedOverlay({
  title = "Desbloqueie este recurso",
  bullets = ["Mais controle em menos tempo", "Recursos premium liberados automaticamente"],
  cta = "Ver planos"
}: {
  title?: string;
  bullets?: string[];
  cta?: string;
}) {
  return (
    <div
      role="note"
      aria-label="Recurso bloqueado"
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 16,
        background: "color-mix(in srgb, var(--bg) 76%, transparent)",
        backdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "center",
        padding: 14
      }}
    >
      <div className="card" style={{ padding: 14, maxWidth: 420, width: "100%" }}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>{title}</div>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
          {bullets.map((b) => (
            <li key={b} className="muted" style={{ fontSize: 13 }}>{b}</li>
          ))}
        </ul>
        <div style={{ height: 12 }} />
        <Link href="/planos" className="btn btnPrimary" aria-label="Ver planos">
          {cta}
        </Link>
      </div>
    </div>
  );
}

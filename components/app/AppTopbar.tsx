"use client";

import React, { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { getMeClient } from "@/components/auth/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AppTopbar({ month }: { month: string }) {
  const [me, setMe] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    getMeClient().then(setMe).catch(() => setMe(null));
  }, []);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "color-mix(in srgb, var(--bg) 92%, transparent)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "saturate(150%) blur(10px)"
      }}
    >
      <div className="container" style={{ height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <Link href="/app" aria-label="Ir para dashboard">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <Logo size={28} />
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ display: "grid", gap: 4 }}>
            <span className="muted" style={{ fontSize: 11 }}>Mês</span>
            <select
              value={month}
              onChange={(e) => {
                const m = e.target.value;
                router.push(`/app?month=${encodeURIComponent(m)}`);
              }}
              className="card"
              style={{ padding: "10px 10px", border: "1px solid var(--border)", borderRadius: 14, minWidth: 140 }}
              aria-label="Selecionar mês"
            >
              {getMonthOptions().map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>

          {me?.planId === "ULTRA" || me?.planId === "MAX" ? (
            <Link href="/app/kash-ai" className="btn btnPrimary" aria-label="Abrir Kash AI" style={{ padding: "10px 12px" }}>
              Kash AI
            </Link>
          ) : (
            <Link href="/planos" className="btn" aria-label="Ver planos" style={{ padding: "10px 12px" }}>
              Planos
            </Link>
          )}

          <Link href="/conta" className="btn" aria-label="Minha conta" style={{ padding: "10px 12px" }}>
            Conta
          </Link>
        </div>
      </div>
    </div>
  );
}

function getMonthOptions() {
  // simple last 12 months list
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const m = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    out.push(m);
  }
  return out;
}

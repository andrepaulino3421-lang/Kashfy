
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/config/site.config";
import type { PlanId } from "@/lib/types";
import { getMeClient } from "@/components/auth/client";

function saveSelectedPlan(planId: PlanId) {
  try {
    localStorage.setItem("kashfy_selected_plan", planId);
  } catch {}
}

export function PricingGrid() {
  const plans = siteConfig.plans;
  const [authed, setAuthed] = useState<boolean>(false);

  useEffect(() => {
    getMeClient().then((me) => setAuthed(!!me)).catch(() => setAuthed(false));
  }, []);

  const comparativo = useMemo(() => {
    const all = new Set<string>();
    for (const p of plans) for (const f of p.features) all.add(f);
    return Array.from(all);
  }, [plans]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 12 }} className="pricingGrid">
        {plans.map((p) => (
          <div key={p.id} className="card" style={{ padding: 16, position: "relative" }}>
            {p.highlight && (
              <div className="badge badgeGreen" style={{ position: "absolute", top: 14, right: 14 }}>
                Destaque
              </div>
            )}
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 900, fontSize: 16 }}>{p.name}</div>
              <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.3 }}>{p.priceLabel}</div>
              <div className="muted" style={{ fontSize: 13 }}>
                {p.billingPeriod} {p.renewalNote ? `• ${p.renewalNote}` : ""}
              </div>
              {p.shortNote && <div className="muted" style={{ fontSize: 13 }}>{p.shortNote}</div>}
            </div>

            <div style={{ height: 12 }} />

            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
              {p.features.slice(0, 6).map((f) => (
                <li key={f} style={{ fontSize: 14 }}>{f}</li>
              ))}
            </ul>

            {p.extraNotes?.length ? (
              <>
                <div style={{ height: 10 }} />
                <div className="muted" style={{ fontSize: 13 }}>
                  {p.extraNotes.map((n) => (
                    <div key={n}>• {n}</div>
                  ))}
                </div>
              </>
            ) : null}

            <div style={{ height: 14 }} />

            <button
              className={p.id === "FREE" ? "btn" : "btn btnPrimary"}
              onClick={() => {
                saveSelectedPlan(p.id);
                if (p.id === "FREE") {
                  window.location.href = authed ? "/app" : "/cadastro?plan=FREE";
                  return;
                }
                if (!authed) {
                  const url = `/login?next=checkout&plan=${encodeURIComponent(p.id)}`;
                  window.location.href = url;
                  return;
                }
                if (p.checkoutUrl) window.location.href = p.checkoutUrl;
              }}
              aria-label={p.id === "FREE" ? "Continuar grátis" : `Assinar plano ${p.id}`}
            >
              {p.ctaLabel}
            </button>

            {p.id !== "FREE" && (
              <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
                Pagamento no checkout em até 12x (conforme disponibilidade).
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Comparativo (resumo)</div>
        <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
          Este comparativo é simples e editável via config. No app, recursos também são bloqueados no backend.
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table" style={{ minWidth: 720 }}>
            <thead>
              <tr>
                <th>Recurso</th>
                {plans.map((p) => (
                  <th key={p.id}>{p.id}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparativo.slice(0, 10).map((f) => (
                <tr key={f}>
                  <td>{f}</td>
                  {plans.map((p) => (
                    <td key={p.id}>{p.features.includes(f) ? "✓" : "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .pricingGrid{
          grid-template-columns: 1fr;
        }
        @media (min-width: 900px){
          .pricingGrid{
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}


"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/Button";
import Link from "next/link";
import { Toast } from "@/components/auth/Toast";
import { siteConfig } from "@/config/site.config";

export default function CadastroPage() {
  const sp = useSearchParams();
  const plan = (sp.get("plan") || "FREE") as any;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("kashfy_selected_plan", plan);
    } catch {}
  }, [plan]);

  return (
    <AuthShell title="Criar conta" subtitle="Em 2 minutos você começa. Você pode continuar grátis e fazer upgrade quando quiser.">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setToast(null);
          try {
            const res = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password, name: name || undefined })
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              setToast(data?.error || "Não foi possível criar sua conta.");
              setLoading(false);
              return;
            }

            if (plan && plan !== "FREE") {
              const found = siteConfig.plans.find((p) => p.id === plan);
              if (found?.checkoutUrl) {
                window.location.href = found.checkoutUrl;
                return;
              }
            }

            window.location.href = "/app";
          } catch {
            setToast("Erro de rede. Tente novamente.");
          } finally {
            setLoading(false);
          }
        }}
        style={{ display: "grid", gap: 12 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span className="muted" style={{ fontSize: 13 }}>Nome (opcional)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="card"
            style={{ padding: 12, borderRadius: 14, border: "1px solid var(--border)" }}
            type="text"
            autoComplete="name"
            maxLength={60}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span className="muted" style={{ fontSize: 13 }}>E-mail</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="card"
            style={{ padding: 12, borderRadius: 14, border: "1px solid var(--border)" }}
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span className="muted" style={{ fontSize: 13 }}>Senha (mínimo 8 caracteres)</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="card"
            style={{ padding: 12, borderRadius: 14, border: "1px solid var(--border)" }}
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </label>

        <Button variant="primary" type="submit" disabled={loading} aria-label="Criar conta">
          {loading ? "Criando..." : plan !== "FREE" ? "Criar conta e ir ao checkout" : "Criar conta"}
        </Button>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <Link href="/login" className="muted" style={{ fontSize: 13, textDecoration: "underline" }}>
            Já tenho conta
          </Link>
          <Link href="/planos" className="muted" style={{ fontSize: 13, textDecoration: "underline" }}>
            Ver planos
          </Link>
        </div>
      </form>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </AuthShell>
  );
}

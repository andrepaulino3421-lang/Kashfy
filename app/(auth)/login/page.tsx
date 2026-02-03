
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/Button";
import Link from "next/link";
import { Toast } from "@/components/auth/Toast";
import { siteConfig } from "@/config/site.config";

export default function LoginPage() {
  const sp = useSearchParams();
  const next = sp.get("next") || "";
  const plan = (sp.get("plan") || "") as any;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Restore plan if missing
    if (!plan) {
      try {
        const saved = localStorage.getItem("kashfy_selected_plan");
        if (saved) {
          const url = new URL(window.location.href);
          url.searchParams.set("plan", saved);
          window.history.replaceState({}, "", url.toString());
        }
      } catch {}
    }
  }, [plan]);

  const title = useMemo(() => "Entrar", []);
  const subtitle = useMemo(() => "Acesse sua conta e continue com clareza.", []);

  return (
    <AuthShell title={title} subtitle={subtitle}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setToast(null);
          try {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password })
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              setToast(data?.error || "Não foi possível entrar. Tente novamente.");
              setLoading(false);
              return;
            }

            // Redirect logic: login before checkout
            if (next === "checkout") {
              const pid = (plan || "").toString() || localStorage.getItem("kashfy_selected_plan") || "";
              const found = siteConfig.plans.find((p) => p.id === pid);
              if (found?.checkoutUrl) {
                window.location.href = found.checkoutUrl;
                return;
              }
              window.location.href = "/planos";
              return;
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
          <span className="muted" style={{ fontSize: 13 }}>Senha</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="card"
            style={{ padding: 12, borderRadius: 14, border: "1px solid var(--border)" }}
            type="password"
            autoComplete="current-password"
            required
          />
        </label>

        <Button variant="primary" type="submit" disabled={loading} aria-label="Entrar">
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <Link href="/recuperar-senha" className="muted" style={{ fontSize: 13, textDecoration: "underline" }}>
            Esqueci minha senha
          </Link>
          <Link href="/cadastro" className="muted" style={{ fontSize: 13, textDecoration: "underline" }}>
            Criar conta
          </Link>
        </div>
      </form>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </AuthShell>
  );
}

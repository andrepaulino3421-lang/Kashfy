
"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/Button";
import { Toast } from "@/components/auth/Toast";
import Link from "next/link";

export default function RecuperarSenhaPage() {
  const sp = useSearchParams();
  const token = sp.get("token") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isReset = token.length > 20;

  return (
    <AuthShell
      title={isReset ? "Definir nova senha" : "Recuperar senha"}
      subtitle={
        isReset
          ? "Crie uma nova senha para acessar sua conta."
          : "Digite seu e-mail. Vamos gerar um link de recuperação."
      }
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setToast(null);

          try {
            if (!isReset) {
              const res = await fetch("/api/auth/forgot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) {
                setToast(data?.error || "Não foi possível solicitar recuperação.");
                setLoading(false);
                return;
              }
              setToast("Se o e-mail existir, enviaremos um link. (No dev, ele aparece no console.)");
              setLoading(false);
              return;
            }

            const res2 = await fetch("/api/auth/reset", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token, password })
            });
            const data2 = await res2.json().catch(() => ({}));
            if (!res2.ok) {
              setToast(data2?.error || "Não foi possível redefinir a senha.");
              setLoading(false);
              return;
            }
            setToast("Senha atualizada. Você já pode entrar.");
            setTimeout(() => (window.location.href = "/login"), 900);
          } catch {
            setToast("Erro de rede. Tente novamente.");
          } finally {
            setLoading(false);
          }
        }}
        style={{ display: "grid", gap: 12 }}
      >
        {!isReset ? (
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
        ) : (
          <label style={{ display: "grid", gap: 6 }}>
            <span className="muted" style={{ fontSize: 13 }}>Nova senha</span>
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
        )}

        <Button variant="primary" type="submit" disabled={loading} aria-label={isReset ? "Salvar nova senha" : "Enviar link de recuperação"}>
          {loading ? "Aguarde..." : isReset ? "Salvar nova senha" : "Enviar link"}
        </Button>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <Link href="/login" className="muted" style={{ fontSize: 13, textDecoration: "underline" }}>
            Voltar para entrar
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

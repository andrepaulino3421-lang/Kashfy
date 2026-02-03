"use client";

import React, { useMemo, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export function KashAIChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Oi! Eu sou a Kash AI 💚 Me diga seu objetivo do mês ou uma dúvida sobre gastos." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const last = useMemo(() => msgs[msgs.length - 1], [msgs]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setLoading(true);
    try {
      const res = await fetch("/api/kash-ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erro");
      setMsgs([...next, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setMsgs([...next, { role: "assistant", content: "Tive um probleminha agora. Tenta de novo em alguns segundos 🙏" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "grid", gap: 10, minHeight: 360 }}>
        <div style={{ display: "grid", gap: 10 }}>
          {msgs.map((m, i) => (
            <Bubble key={i} role={m.role} content={m.content} />
          ))}
          {loading && <Bubble role="assistant" content="Pensando..." />}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex.: Como cortar gastos sem sofrer?"
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            aria-label="Mensagem para Kash AI"
          />
          <button className="btn btnPrimary" onClick={send} disabled={loading} aria-label="Enviar mensagem">
            Enviar
          </button>
        </div>

        <div className="muted" style={{ fontSize: 12 }}>
          Dica: descreva seu objetivo + renda + principais gastos. Eu devolvo um plano bem prático.
        </div>
      </div>
    </div>
  );
}

function Bubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "78%",
          padding: "10px 12px",
          borderRadius: 14,
          border: "1px solid var(--border)",
          background: isUser ? "color-mix(in srgb, var(--brand) 16%, var(--card))" : "rgba(255,255,255,.03)"
        }}
      >
        <div style={{ whiteSpace: "pre-wrap" }}>{content}</div>
      </div>
    </div>
  );
}

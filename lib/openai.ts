
type OpenAIMessage = { role: "system" | "user" | "assistant"; content: string };

function env(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`${name} is missing`);
  return v;
}

export async function chatWithKashAI(params: {
  messages: OpenAIMessage[];
  monthContext?: string;
  summaryStats?: Record<string, string | number>;
}): Promise<string> {
  const apiKey = env("OPENAI_API_KEY");
  const model = env("OPENAI_MODEL", "gpt-4.1-mini");
  const temperature = Number(process.env.OPENAI_TEMPERATURE ?? "0.4");

  const system: OpenAIMessage = {
    role: "system",
    content:
      "Você é o Kash AI do KashFy. Responda em PT-BR, de forma curta e objetiva, com sugestões acionáveis, sem promessas irreais. Não peça dados sensíveis. Se o usuário pedir algo fora do escopo, redirecione para organização financeira. Se houver contexto do mês, use-o."
  };

  const contextParts: string[] = [];
  if (params.monthContext) contextParts.push(`Contexto do mês:\n${params.monthContext}`);
  if (params.summaryStats) contextParts.push(`Resumo (stats):\n${JSON.stringify(params.summaryStats)}`);

  const contextMsg: OpenAIMessage | null =
    contextParts.length > 0
      ? { role: "system", content: contextParts.join("\n\n") }
      : null;

  const inputMessages = [system, ...(contextMsg ? [contextMsg] : []), ...params.messages].map((m) => ({
    role: m.role,
    content: m.content
  }));

  // Prefer Responses API; fallback to Chat Completions if needed.
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature,
      input: inputMessages
    })
  });

  if (res.ok) {
    const data = (await res.json()) as any;
    const text =
      data?.output_text ??
      data?.output?.[0]?.content?.find((c: any) => c.type === "output_text")?.text ??
      "";
    if (typeof text === "string" && text.trim().length > 0) return text.trim();
  }

  // Fallback
  const res2 = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature,
      messages: inputMessages
    })
  });

  if (!res2.ok) {
    const err = await res2.text();
    throw new Error(`OpenAI error: ${err.slice(0, 300)}`);
  }

  const data2 = (await res2.json()) as any;
  const reply = data2?.choices?.[0]?.message?.content;
  if (!reply || typeof reply !== "string") throw new Error("OpenAI returned empty reply");
  return reply.trim();
}

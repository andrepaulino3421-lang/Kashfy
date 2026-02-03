
import { formatBRLFromCents } from "@/lib/format";

export function BarList({ items }: { items: Array<{ name: string; valueCents: number }> }) {
  const max = Math.max(1, ...items.map((i) => i.valueCents));
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((i) => (
        <div key={i.name} style={{ display: "grid", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{i.name}</div>
            <div className="muted" style={{ fontSize: 13 }}>{formatBRLFromCents(i.valueCents)}</div>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: "var(--soft)", border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(i.valueCents / max) * 100}%`, background: "var(--green)", opacity: 0.85 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

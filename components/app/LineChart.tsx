
import { formatBRLFromCents } from "@/lib/format";

export function LineChart({ points }: { points: Array<{ day: number; valueCents: number }> }) {
  if (!points.length) return null;

  const w = 520;
  const h = 140;
  const pad = 18;

  const xs = points.map((p) => p.day);
  const ys = points.map((p) => p.valueCents);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const scaleX = (x: number) => pad + ((x - minX) / Math.max(1, maxX - minX)) * (w - pad * 2);
  const scaleY = (y: number) => h - pad - ((y - minY) / Math.max(1, maxY - minY)) * (h - pad * 2);

  const d = points
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${scaleX(p.day).toFixed(2)} ${scaleY(p.valueCents).toFixed(2)}`)
    .join(" ");

  const last = points[points.length - 1];

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role="img" aria-label="Gráfico de saldo diário">
        <rect x="0" y="0" width={w} height={h} rx="16" fill="var(--soft)" stroke="var(--border)" />
        <path d={d} fill="none" stroke="var(--green)" strokeWidth="3" />
        <circle cx={scaleX(last.day)} cy={scaleY(last.valueCents)} r="4" fill="var(--green)" />
      </svg>
      <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>
        Último ponto: dia {last.day} • {formatBRLFromCents(last.valueCents)}
      </div>
    </div>
  );
}

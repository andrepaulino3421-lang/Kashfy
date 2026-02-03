
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container" style={{ padding: "28px 0 40px" }}>
      <div className="card" style={{ padding: 18 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Página não encontrada</h1>
        <p className="muted" style={{ lineHeight: 1.7 }}>
          O link pode ter sido movido. Volte para a home ou veja os planos.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/" className="btn btnPrimary">Home</Link>
          <Link href="/planos" className="btn">Planos</Link>
        </div>
      </div>
    </section>
  );
}

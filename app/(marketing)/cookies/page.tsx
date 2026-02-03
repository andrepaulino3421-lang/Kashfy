
export default function CookiesPage() {
  return (
    <section className="container" style={{ padding: "22px 0 40px" }}>
      <h1 style={{ margin: 0, fontSize: 24, letterSpacing: -0.3 }}>Cookies</h1>
      <p className="muted" style={{ lineHeight: 1.7 }}>
        Usamos cookies essenciais para manter sua sessão e melhorar a experiência. Ajuste este texto conforme sua política.
      </p>
      <div className="card" style={{ padding: 16 }}>
        <div className="muted" style={{ lineHeight: 1.7 }}>
          <p><strong>Essenciais</strong>: login e proteção de rotas.</p>
          <p><strong>Preferências</strong>: (opcional) salvar plano selecionado para redirecionamento ao checkout.</p>
        </div>
      </div>
    </section>
  );
}

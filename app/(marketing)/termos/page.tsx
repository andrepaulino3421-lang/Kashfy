
import { siteConfig } from "@/config/site.config";

export default function TermosPage() {
  return (
    <section className="container" style={{ padding: "22px 0 40px" }}>
      <h1 style={{ margin: 0, fontSize: 24, letterSpacing: -0.3 }}>Termos</h1>
      <p className="muted" style={{ lineHeight: 1.7 }}>
        Texto de termos editável. Ajuste conforme necessário. Este site oferece {siteConfig.brandName} com garantia de {siteConfig.guaranteeDays} dias.
      </p>
      <div className="card" style={{ padding: 16 }}>
        <div className="muted" style={{ lineHeight: 1.7 }}>
          <p><strong>1.</strong> Uso do serviço</p>
          <p><strong>2.</strong> Pagamentos e assinaturas</p>
          <p><strong>3.</strong> Cancelamento e garantia</p>
          <p><strong>4.</strong> Privacidade</p>
          <p>Substitua este conteúdo pelo seu texto jurídico.</p>
        </div>
      </div>
    </section>
  );
}

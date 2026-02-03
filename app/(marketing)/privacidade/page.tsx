
import { siteConfig } from "@/config/site.config";

export default function PrivacidadePage() {
  return (
    <section className="container" style={{ padding: "22px 0 40px" }}>
      <h1 style={{ margin: 0, fontSize: 24, letterSpacing: -0.3 }}>Privacidade</h1>
      <p className="muted" style={{ lineHeight: 1.7 }}>
        Texto de privacidade editável. Não vendemos seus dados. Suporte: {siteConfig.supportEmail}.
      </p>
      <div className="card" style={{ padding: 16 }}>
        <div className="muted" style={{ lineHeight: 1.7 }}>
          <p><strong>Coleta</strong>: e-mail e dados necessários para operar o app.</p>
          <p><strong>Segurança</strong>: senha com hash e sessão via cookies httpOnly.</p>
          <p><strong>IA</strong>: quando habilitada, envia contexto mínimo para o provedor de IA, sem expor sua chave no front.</p>
          <p>Substitua por texto jurídico adequado.</p>
        </div>
      </div>
    </section>
  );
}

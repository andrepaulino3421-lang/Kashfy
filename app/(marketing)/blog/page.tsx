
import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export default function BlogListPage() {
  const posts = siteConfig.blog.posts;
  return (
    <section className="container" style={{ padding: "22px 0 40px" }}>
      <h1 style={{ margin: 0, fontSize: 24, letterSpacing: -0.3 }}>{siteConfig.blog.title}</h1>
      <p className="muted" style={{ lineHeight: 1.7 }}>{siteConfig.blog.description}</p>

      <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 900 }}>{p.title}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>{p.date}</div>
            <div className="muted" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.7 }}>{p.excerpt}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

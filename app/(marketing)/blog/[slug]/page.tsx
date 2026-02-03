
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site.config";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = siteConfig.blog.posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <section className="container" style={{ padding: "22px 0 40px" }}>
      <h1 style={{ margin: 0, fontSize: 24, letterSpacing: -0.3 }}>{post.title}</h1>
      <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>{post.date}</div>
      <div className="card" style={{ padding: 16, marginTop: 14 }}>
        <div className="muted" style={{ lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </div>
    </section>
  );
}

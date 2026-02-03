
import { siteConfig } from "@/config/site.config";

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="4" y="4" width="40" height="40" rx="12" fill="var(--greenSoft)" stroke="var(--border)" />
        <path
          d="M24 11c4 0 7 3 7 7 0 3-2 5-4 6 4 1 6 4 6 8 0 5-4 9-11 9-3 0-6-1-8-2l2-4c2 1 4 2 6 2 4 0 6-2 6-5 0-3-2-4-5-4h-3v-5h3c3 0 4-2 4-4 0-3-2-5-5-5-2 0-4 1-6 2l-2-4c3-2 6-3 10-3z"
          fill="var(--green)"
        />
        <path d="M12 33l7-6 8 5 16-15v6L27 37l-8-5-7 6v-5z" fill="var(--green)" />
      </svg>
      <span style={{ fontWeight: 800, letterSpacing: -0.2, fontSize: 18 }}>{siteConfig.brandName}</span>
    </div>
  );
}

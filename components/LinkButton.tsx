
"use client";

import Link from "next/link";
import React from "react";

export function LinkButton({
  href,
  children,
  variant = "ghost",
  className = "",
  onClick
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
}) {
  const cls =
    variant === "primary"
      ? `btn btnPrimary ${className}`.trim()
      : `btn ${className}`.trim();

  return (
    <Link href={href} className={cls} onClick={onClick as any}>
      {children}
    </Link>
  );
}

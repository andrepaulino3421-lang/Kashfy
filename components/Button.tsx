
"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ variant = "ghost", className = "", ...props }: Props) {
  const cls =
    variant === "primary"
      ? `btn btnPrimary ${className}`.trim()
      : `btn ${className}`.trim();

  return <button {...props} className={cls} />;
}

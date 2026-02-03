
"use client";

import React, { useEffect, useState } from "react";

export function Toast({ message, onDone }: { message: string; onDone?: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false);
      onDone?.();
    }, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="card"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 100,
        padding: 12,
        background: "var(--surface)",
        maxWidth: 560,
        margin: "0 auto"
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14 }}>{message}</div>
    </div>
  );
}

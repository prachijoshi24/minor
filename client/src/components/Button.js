// client/src/components/Button.js
import React from "react";

export default function Button({ children, onClick, variant = "primary", className = "" }) {
  const base = "btn";
  if (variant === "ghost") return <button onClick={onClick} className={`btn-ghost ${className}`}>{children}</button>;
  return <button onClick={onClick} className={`${base} ${className}`}>{children}</button>;
}
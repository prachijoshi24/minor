// src/components/ChartCard.jsx
import React from "react";
import "../styles/progress.css";

// Simple presentational wrapper for charts (canvas handled in pages)
export default function ChartCard({ title, children }) {
  return (
    <section className="card chart-card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </section>
  );
}
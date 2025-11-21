// src/components/RelaxCard.jsx
import React from "react";
import "../styles/relax.css";

export default function RelaxCard({ title, children, onStart }) {
  return (
    <article className="card relax-card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
      {onStart && <div className="card-footer"><button className="btn" onClick={onStart}>Start</button></div>}
    </article>
  );
}
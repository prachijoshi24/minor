// src/components/AssessmentCard.jsx
import React from "react";
import "../styles/assessment.css";

export default function AssessmentCard({ title, children, onOpen }) {
  return (
    <article className="card assessment-card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
      {onOpen && <div className="card-footer"><button className="btn" onClick={onOpen}>Open →</button></div>}
    </article>
  );
}
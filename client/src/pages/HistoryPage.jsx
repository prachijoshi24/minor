// src/pages/HistoryPage.jsx
import React, { useEffect, useState } from "react";

export default function HistoryPage() {
  const [assess, setAssess] = useState([]);
  useEffect(() => {
    const a = JSON.parse(localStorage.getItem("cbt_assessments") || "[]");
    setAssess(a);
  }, []);

  function clearAll() {
    if (!window.confirm("Clear all assessment history?")) return;
    localStorage.removeItem("cbt_assessments");
    setAssess([]);
  }

  return (
    <div className="page max-wide">
      <h2>Session History</h2>
      <p className="muted">All your past assessments and their results.</p>

      <div>
        {assess.length === 0 && <div className="muted">No history yet.</div>}
        {assess.map(s => (
          <div className="card small" key={s.id}>
            <div><strong>{s.answers?.fearType || s.severity}</strong></div>
            <div className="muted">{new Date(s.timestamp).toLocaleString()}</div>
            <div>Score: {s.score}</div>
          </div>
        ))}
      </div>

      <div style={{marginTop: 16}}>
        <button className="btn danger" onClick={clearAll}>Clear History</button>
      </div>
    </div>
  );
}
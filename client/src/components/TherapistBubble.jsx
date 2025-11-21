// src/components/TherapistBubble.jsx
import React from "react";
import "../styles/ait.css";

export function UserBubble({ text, time }) {
  return <div className="bubble user"><div className="bubble-text">{text}</div><div className="bubble-time">{time}</div></div>;
}

export function AssistantBubble({ text, time }) {
  return <div className="bubble assistant"><div className="bubble-text">{text}</div><div className="bubble-time">{time}</div></div>;
}
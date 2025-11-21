import React from "react";

export default function SessionSummary({ messages }) {
  const generateSummary = async () => {
    // put a system prompt + messages and ask AI for a short summary & plan
    const system = { role: "system", content: "You are a professional CBT therapist. Provide a concise session summary and a 3-step plan for the user." };
    const res = await fetch("http://localhost:5002/api/chat", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ messages: [system, ...messages] })
    });
    const j = await res.json();
    alert("Session summary:\n\n" + (j.reply || "No reply"));
  };

  return (
    <div>
      <button onClick={generateSummary} className="bg-rose-500 px-3 py-2 text-white rounded">Generate Summary</button>
    </div>
  );
}



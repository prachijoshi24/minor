import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const safeConfirm = (msg) => window.confirm(msg); // Fix ESLint restricted global

export default function ChatHistory() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:5002/api/history");
        const j = await r.json();
        setSessions(j.sessions || []);
      } catch (err) {
        console.error("History fetch error:", err);
      }
    })();
  }, []);

  const openSession = async (id) => {
    try {
      const r = await fetch(`http://localhost:5002/api/session/${id}`);
      const j = await r.json();
      if (j.session) {
        const newWindow = window.open("", "_blank");
        newWindow.document.title = j.session.title;
        newWindow.document.body.innerHTML = `
          <pre style="white-space: pre-wrap; font-family: monospace; padding: 16px;">
${JSON.stringify(j.session, null, 2)}
          </pre>`;
      }
    } catch (err) {
      console.error("Open session error:", err);
    }
  };

  const deleteSession = async (id) => {
    if (!safeConfirm("Are you sure you want to delete this saved session?")) return;

    await fetch(`http://localhost:5002/api/session/${id}`, { method: "DELETE" });
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-rose-600">Saved Sessions</h2>
        <Link to="/" className="text-sm text-rose-600 underline">
          ← Back Home
        </Link>
      </div>

      {sessions.length === 0 && (
        <p className="text-gray-500 text-center">No saved sessions yet.</p>
      )}

      <div className="space-y-4">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 border border-pink-100 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-rose-600 text-lg">
                  {s.title}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(s.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openSession(s.id)}
                  className="px-3 py-1 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm hover:bg-rose-50"
                >
                  Open
                </button>

                <button
                  onClick={() => deleteSession(s.id)}
                  className="px-3 py-1 bg-rose-500 text-white rounded-lg text-sm shadow hover:bg-rose-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
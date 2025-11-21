import React, { useState } from "react";

export default function ChatbotPage(){
  const [messages, setMessages] = useState([
    {id:1, from:"bot", text:"Hi — I'm your CBT assistant. Share a quick sentence about how you feel."}
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(){
    if (!text.trim()) return;
    const userText = text.trim();
    setMessages(m=>[...m, {id:Date.now(), from:"user", text:userText}]);
    setText("");
    setLoading(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ message: userText })
      });
      const j = await r.json();
      const botText = j.reply || j.error || "Sorry, no response.";
      setMessages(m=>[...m, {id:Date.now()+1, from:"bot", text:botText}]);
    } catch (err) {
      setMessages(m=>[...m, {id:Date.now()+1, from:"bot", text:`Error: ${String(err)}`}]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 className="h1">AI Therapist (CBT Assistant)</h1>
      <div className="card" style={{minHeight:360,display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,overflowY:"auto",padding:12}}>
          {messages.map(m=>(
            <div key={m.id} style={{marginBottom:8, textAlign: m.from==="bot"?"left":"right"}}>
              <div style={{display:"inline-block",background:m.from==="bot"?"#fff":"var(--accent-dark)",color:m.from==="bot"?"#111":"#fff",padding:"8px 12px",borderRadius:12,maxWidth:"80%"}}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{display:"flex",gap:8,marginTop:8}}>
          <input style={{flex:1,padding:10,borderRadius:8,border:"1px solid #eee"}} value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{ if (e.key==="Enter") send(); }} placeholder="Type a thought or feeling..." />
          <button className="btn" onClick={send} disabled={loading}>{loading ? "Thinking..." : "Send"}</button>
        </div>
      </div>
      <div style={{marginTop:12}}><small className="small-muted">Note: This connects to a server that forwards to OpenAI. Configure your API key in server/.env.</small></div>
    </div>
  );
}

// client/src/pages/TherapistPage.js
import React, { useEffect, useRef, useState } from "react";

const LOCAL_FALLBACK = "I can't reach the AI server right now — try describing what happened and I can help with coping steps.";

export default function TherapistPage(){
  const [messages, setMessages] = useState([{id:"s1", who:"bot", text:"Hi — I'm your CBT assistant. Tell me how you're feeling."}]);
  const [txt, setTxt] = useState("");
  const scroller = useRef();

  useEffect(()=> { if(scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [messages]);

  async function send(){
    const content = txt.trim(); if(!content) return;
    const userMsg = { id:Date.now(), who:"user", text:content };
    setMessages(m => [...m, userMsg]);
    setTxt("");
    // try local fetch to your server endpoint /api/chat if it exists
    try {
      const res = await fetch("http://localhost:5002/api/chat", {
        method:"POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ messages: [{ role:"user", content }] })
      });
      const j = await res.json();
      const reply = j.reply || j?.choices?.[0]?.message?.content || LOCAL_FALLBACK;
      setMessages(m=>[...m, { id:"b"+Date.now(), who:"bot", text: reply }]);
    } catch(err){
      setMessages(m=>[...m, { id:"b"+Date.now(), who:"bot", text: LOCAL_FALLBACK }]);
    }
    // save snippet in history
    const h = JSON.parse(localStorage.getItem("cbt_history")||"[]");
    h.unshift({ kind:"chat", transcript:[userMsg], timestamp: Date.now() });
    localStorage.setItem("cbt_history", JSON.stringify(h.slice(0,200)));
  }

  function handleKey(e){
    if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); send(); }
  }

  return (
    <div>
      <div className="card" style={{marginBottom:12}}>
        <h1 style={{margin:0}}>AI CBT Assistant</h1>
        <div className="muted" style={{marginTop:6}}>A supportive assistant to guide coping steps (not a replacement for therapy).</div>
      </div>

      <div className="card" style={{padding:12}}>
        <div ref={scroller} style={{height:420, overflow:"auto", padding:8, borderRadius:8, background:"linear-gradient(180deg,#fbfefb, #fff)"}}>
          {messages.map(m => (
            <div key={m.id} style={{display:"flex", justifyContent: m.who === "user" ? "flex-end" : "flex-start", marginTop:8}}>
              <div style={{
                maxWidth:"78%",
                padding:12,
                borderRadius:12,
                background: m.who === "user" ? "linear-gradient(180deg,#e8f6ea,#dff1e2)" : "#fff",
                border: "1px solid rgba(36,49,58,0.04)"
              }}>{m.text}</div>
            </div>
          ))}
        </div>

        <div style={{display:"flex", gap:10, marginTop:12}}>
          <textarea value={txt} onChange={(e)=>setTxt(e.target.value)} onKeyDown={handleKey} rows={2} className="input" placeholder="Describe what you're feeling..." />
          <div style={{width:120, display:"flex", alignItems:"center"}}>
            <button className="btn" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
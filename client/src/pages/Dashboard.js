import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard(){
  return (
    <div>
      <div style={{padding:28, borderRadius:12, background:"#eaf6ec", marginBottom:18}}>
        <h1 style={{margin:0}}>Begin Your Step-Wise CBT Program</h1>
        <p className="small">A structured, research-based pathway to gently reduce fear and build resilience.</p>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Step 1 — Professional Assessment</h3>
          <p>Scientist-designed quiz to identify fear type & intensity.</p>
          <p style={{marginTop:12}}><Link to="/quiz">Open →</Link></p>
        </div>

        <div className="card">
          <h3>Step 2 — Instant Relaxation</h3>
          <p>Guided calming exercises to help you regulate in the moment.</p>
          <p style={{marginTop:12}}><Link to="/relax">Open →</Link></p>
        </div>

        <div className="card">
          <h3>Journal</h3>
          <p>Reflective writing to process experiences and track patterns.</p>
          <p style={{marginTop:12}}><Link to="/journal">Open →</Link></p>
        </div>

        <div className="card">
          <h3>Progress & Insights</h3>
          <p>View your improvements, mood patterns, and milestones.</p>
          <p style={{marginTop:12}}><Link to="/progress">Open →</Link></p>
        </div>

        <div className="card">
          <h3>Exposure Lab</h3>
          <p>Safe visual exposure with object placement & scaling.</p>
          <p style={{marginTop:12}}><Link to="/exposure">Open →</Link></p>
        </div>

        <div className="card">
          <h3>CBT Assistant (AI)</h3>
          <p>An optional companion to guide coping strategies and CBT steps.</p>
          <p style={{marginTop:12}}><Link to="/chat">Open →</Link></p>
        </div>
      </div>

      <section style={{marginTop:26}}>
        <div className="card">
          <h4>How this program is structured</h4>
          <p className="small">Begin with a validated assessment. Get tailored instant-relax steps, journaling prompts, long-term plans and an exposure tool. Everything is local and private in your browser.</p>
        </div>
      </section>
    </div>
  );
}
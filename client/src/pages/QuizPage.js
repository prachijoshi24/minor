import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
 Simple scientist-like quiz:
 - 6 questions, each with 0..3 scale.
 - type detection based on items groups.
 - intensity is total score.
*/

const QUESTIONS = [
  { id:1, text:"I feel nervous in social situations or speaking to groups.", type:"social" },
  { id:2, text:"I avoid places where escape might be difficult (crowds, open spaces).", type:"agora" },
  { id:3, text:"I feel intense fear around specific objects (spiders, needles, heights).", type:"specific" },
  { id:4, text:"Physical symptoms (racing heart, breathlessness) when I face my fear.", type:"phys" },
  { id:5, text:"I often worry about panic attacks or losing control.", type:"panic" },
  { id:6, text:"I avoid situations because of fear that I will be embarrassed.", type:"social" },
];

export default function QuizPage(){
  const navigate = useNavigate();
  const [answers,setAnswers] = useState(() => QUESTIONS.reduce((s,q)=>{s[q.id]=0;return s},{}) );
  const [saved,setSaved] = useState(null);

  function setVal(qid,val){
    setAnswers(a=>({...a,[qid]:Number(val)}));
  }

  function submit(){
    const total = Object.values(answers).reduce((s,n)=>s+n,0);
    // type logic: highest summed type score
    const typeScores = {};
    QUESTIONS.forEach(q=>{
      typeScores[q.type] = (typeScores[q.type] || 0) + answers[q.id];
    });
    const type = Object.keys(typeScores).reduce((a,b)=> typeScores[a]>=typeScores[b]?a:b );
    const intensity = total <= 4 ? "mild" : total <=9 ? "moderate" : "severe";

    const result = { date: new Date().toISOString(), total, type, intensity, answers };
    // store into localStorage sessions
    const sessions = JSON.parse(localStorage.getItem("cbt_sessions")||"[]");
    sessions.unshift(result);
    localStorage.setItem("cbt_sessions", JSON.stringify(sessions));
    // also store current assessment summary
    localStorage.setItem("cbt_last_assessment", JSON.stringify(result));
    setSaved(result);
    // navigate to relaxation with result
    setTimeout(()=> navigate("/relax"), 900);
  }

  return (
    <div>
      <h2>Fear Assessment — Quick validated quiz</h2>
      <p className="small">Answer honestly. This helps tailor instant-relax steps and exposure planning.</p>

      <div style={{marginTop:18}}>
        {QUESTIONS.map(q=>(
          <div key={q.id} className="card" style={{marginBottom:12}}>
            <div style={{marginBottom:8,fontWeight:700}}>{q.text}</div>
            <div style={{display:"flex",gap:8}}>
              {[0,1,2,3].map(v=>(
                <label key={v} style={{display:"flex",alignItems:"center",gap:6}}>
                  <input type="radio" name={"q"+q.id} checked={answers[q.id]===v} onChange={()=>setVal(q.id,v)} />
                  <span style={{fontSize:14}}>{v===0?"Not at all": v===1?"A little": v===2?"Quite a bit":"Very much"}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div style={{display:"flex",gap:12}}>
          <button className="btn" onClick={submit}>Finish Assessment</button>
          <button className="btn" style={{background:"#ddd",color:"#222"}} onClick={()=>{localStorage.removeItem("cbt_last_assessment"); setSaved(null);}}>Clear last</button>
        </div>

        {saved && (
          <div style={{marginTop:16}} className="card">
            <strong>Saved:</strong> {saved.type} — {saved.intensity} (score {saved.total})
          </div>
        )}
      </div>
    </div>
  );
}
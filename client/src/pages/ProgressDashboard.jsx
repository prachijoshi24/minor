import React from "react";
// Note: loadSession is no longer available in the new api.js
// You may need to implement this functionality or update the code to work with the new API
import { Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadarController,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, RadarController, RadialLinearScale, Filler, Tooltip, Legend);

export default function ProgressDashboard(){
  const result = loadSession("assessment_result");
  const history = loadSession("assessment_history", []) || [];
  // Build fake trend if none exists (so charts show)
  const labels = history.map(h => new Date(h.timestamp).toLocaleDateString());
  const dataPoints = history.map(h => h.total);
  if (labels.length === 0 && result) {
    labels.push(new Date(result.timestamp).toLocaleDateString());
    dataPoints.push(result.total);
  }

  const lineData = {
    labels,
    datasets: [
      { label: "Severity score", data: dataPoints, borderColor: "#5a9b6b", backgroundColor: "rgba(90,155,107,0.15)", fill: true, tension:0.3 }
    ]
  };

  // Build radar breakdown (mock split into components)
  const radarData = {
    labels: ["Intensity","Avoidance","Physical","Cognition","Function"],
    datasets: [{
      label: "Profile",
      data: result ? [
        Math.min(12, Math.round(result.total * 0.2)),
        Math.min(12, Math.round(result.total * 0.22)),
        Math.min(12, Math.round(result.total * 0.18)),
        Math.min(12, Math.round(result.total * 0.2)),
        Math.min(12, Math.round(result.total * 0.2))
      ] : [0,0,0,0,0],
      backgroundColor: "rgba(155,201,156,0.35)",
      borderColor: "#6aa975"
    }]
  };

  return (
    <div className="container">
      <h1 className="h1">Progress & Insights</h1>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18,marginTop:12}}>
        <div className="progress-card">
          <h3 className="h2">Severity Trend</h3>
          <div style={{height:220}}>
            <Line data={lineData} />
          </div>
        </div>

        <div className="progress-card">
          <h3 className="h2">Fear Profile</h3>
          <Radar data={radarData} />
        </div>
      </div>

      <div style={{marginTop:18}} className="progress-card">
        <h3 className="h2">Recent Entry</h3>
        {result ? (<div><div style={{fontWeight:700}}>{result.total}</div><div className="small-muted">{result.label}</div></div>) : <div className="small-muted">No data</div>}
      </div>
    </div>
  );
}
